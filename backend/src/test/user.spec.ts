import { startClean } from "@/database/client";
import { Game } from "@/database/models/Game/Game";
import { UserExample } from "@/database/models/User/UserExample";
import { Sequelize } from "sequelize";

describe("User Tests", () => {
	let sequelize: Sequelize;

	beforeEach(async () => {
		sequelize = await startClean();
	});

	afterEach(async () => {
		await sequelize.close();
	});

	it("should create 2 random users and add them as friends", async () => {
		const newUser1 = await UserExample.create();
		const newUser2 = await UserExample.create();

		await newUser1.addFriend(newUser2);

		const user1Friends = await newUser1.getFriends();
		expect(user1Friends).toHaveLength(1);
    	expect(user1Friends[0].id).toBe(newUser2.id);

		const user2Friends = await newUser2.getFriends();
		expect(user2Friends).toHaveLength(1);
		expect(user2Friends[0].id).toBe(newUser1.id);
	});

	
});
