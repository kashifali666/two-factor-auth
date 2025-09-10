import Datastore from "nedb-promises";

export const userInvalidTokens = Datastore.create("UserInvalidTokens.db");
