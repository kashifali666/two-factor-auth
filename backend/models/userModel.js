import Datastore from "nedb-promises";

export const users = Datastore.create("Users.db");
