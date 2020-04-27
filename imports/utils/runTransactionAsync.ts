import { MongoInternals } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'

const runTransactionAsync = async (asyncRawMongoOperations: Function) => {
  const { client } = MongoInternals.defaultRemoteCollectionDriver().mongo
  const session = await client.startSession()

  await session.startTransaction()
  try {
    const result = await asyncRawMongoOperations(session)

    await session.commitTransaction()

    return result
  } catch (err) {
    await session.abortTransaction()

    throw new Meteor.Error('Database Transaction Failed', err.message)
  } finally {
    session.endSession()
  }
}

export default runTransactionAsync
