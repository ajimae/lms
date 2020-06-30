const mongoose = require('mongoose');

const { elasticClient } = require("../clients/elasticClient");
const { getResumetoken, saveResumeTaken } = require('../utils/tokenHelper');

const upsertToken = getResumetoken('SOME_UPSERT_TOKEN_ID');
const deleteToken = getResumetoken('SOME_DELETE_TOKEN_ID');

const CustomerSchema = new mongoose.Schema(
	{
		name: String,
		age: Number,
		address: String
	},
	{ timestamps: true }
);

const Customer = mongoose.model('Customer', CustomerSchema);

// watch for changes (write operation) in this document
Customer.watch([
	{
		$match: {
			operationType: {
				$in: ['insert', 'update', 'replace'],
			},
		},
	},
	{
		$project: {
			documentKey: false,
		},
	}],
	{
		resumeAfter: upsertToken,
		fullDocument: 'updateLookup',
	}
).on('change', function (data) {
	// insert data into es for indexing
	data.fullDocument.id = data.fullDocument._id;
	// data.fullDocument.toObject();
	delete data.fullDocument._id;

	elasticClient.index({
		index: 'customer',
		body: data.fullDocument,
	})
		.then(function (response) {
			console.log("document upserted successsfully with status code", response.statusCode);
		})
		.catch(function (error) { console.log('error:', error.message, error.meta) });
	// save resume token
	saveResumeTaken(data._id, 'SOME_UPSERT_TOKEN_ID');
	// console.log(new Date(), data);
}).on('error', function (error) {
	console.log(error);
});

// watch for delete (mutation operation) in this document
Customer.watch([
	{
		$match: {
			operationType: {
				$in: ['delete'],
			},
		},
	}, {
		$project: {
			documentKey: true,
		},
	}],
	{
		resumeAfter: deleteToken
	}).on('change', async function (data) {
		// delete data from es
		console.log("Deleting data from elasticsearch with id", data.documentKey._id);
		const response = elasticClient.delete({
			index: 'customer',
			id: data.documentKey._id,
		});
		console.log("document deleted successsfully with status code", response.statusCode);
		// await saveResumeTaken(change._id, "SOME_DELETE_TOKEN_ID");
		// save resume token
		saveResumeTaken(data._id, 'SOME_DELETE_TOKEN_ID');
		console.log(new Date(), data);
	}).on('error', function (error) {
		console.log(error);
	});

module.exports = {
	Customer
}
