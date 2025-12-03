import { faker } from "@faker-js/faker/locale/pt_BR";
import type {
	Event,
	EventAttendee,
	Member,
	Ministry,
	Schedule,
	ScheduleVolunteer,
	Tenant,
	Transaction,
	User,
} from "@/types";
import {
	EventStatus,
	MemberStatus,
	ScheduleStatus,
	TransactionCategory,
	TransactionType,
	UserRole,
} from "@/types";

// Set seed for consistent fake data
faker.seed(123);

// Generate Tenant
export const generateTenant = (): Tenant => ({
	id: "1",
	name: "Igreja Batista Esperança",
	subdomain: "esperanca",
	logo: faker.image.urlLoremFlickr({ category: "church" }),
	primaryColor: "#228BE6",
	createdAt: faker.date.past({ years: 2 }).toISOString(),
	updatedAt: faker.date.recent().toISOString(),
});

// Generate Users
export const generateUsers = (count: number = 10): User[] => {
	const roles: UserRole[] = [
		UserRole.ADMIN,
		UserRole.LEADER,
		UserRole.VOLUNTEER,
	];

	return Array.from({ length: count }, (_, index) => ({
		id: `user-${index + 1}`,
		email: faker.internet.email(),
		name: faker.person.fullName(),
		role: index === 0 ? UserRole.ADMIN : faker.helpers.arrayElement(roles),
		tenantId: "1",
		avatar: faker.image.avatar(),
		createdAt: faker.date.past({ years: 1 }).toISOString(),
		updatedAt: faker.date.recent().toISOString(),
	}));
};

// Generate Members
export const generateMembers = (count: number = 100): Member[] => {
	const statuses: MemberStatus[] = [
		MemberStatus.ACTIVE,
		MemberStatus.VISITOR,
		MemberStatus.INACTIVE,
	];

	const tags = [
		"Líder",
		"Diácono",
		"Professor",
		"Músico",
		"Jovem",
		"Criança",
		"Família Nova",
		"Batizado",
		"Membro",
	];

	return Array.from({ length: count }, (_, index) => {
		const birthDate = faker.date.birthdate({ min: 5, max: 80, mode: "age" });

		return {
			id: `member-${index + 1}`,
			name: faker.person.fullName(),
			email: faker.internet.email(),
			phone: faker.phone.number("(##) #####-####"),
			birthDate: birthDate.toISOString().split("T")[0],
			address: {
				street: faker.location.street(),
				number: faker.location.buildingNumber(),
				complement: faker.helpers.maybe(
					() => faker.location.secondaryAddress(),
					{ probability: 0.3 },
				),
				city: faker.location.city(),
				state: faker.location.state({ abbreviated: true }),
				zipCode: faker.location.zipCode("#####-###"),
			},
			photo: faker.image.avatar(),
			status: faker.helpers.arrayElement(statuses),
			tags: faker.helpers.arrayElements(tags, { min: 0, max: 3 }),
			customFields: {
				dataBatismo: faker.helpers.maybe(
					() => faker.date.past({ years: 5 }).toISOString().split("T")[0],
				),
				estadoCivil: faker.helpers.arrayElement([
					"Solteiro",
					"Casado",
					"Viúvo",
					"Divorciado",
				]),
				profissao: faker.person.jobTitle(),
			},
			tenantId: "1",
			createdAt: faker.date.past({ years: 2 }).toISOString(),
			updatedAt: faker.date.recent().toISOString(),
		};
	});
};

// Generate Transactions
export const generateTransactions = (count: number = 200): Transaction[] => {
	const types: TransactionType[] = [
		TransactionType.INCOME,
		TransactionType.EXPENSE,
	];

	return Array.from({ length: count }, (_, index) => {
		const type = faker.helpers.arrayElement(types);
		const category =
			type === TransactionType.INCOME
				? faker.helpers.arrayElement([
						TransactionCategory.TITHE,
						TransactionCategory.OFFERING,
						TransactionCategory.EVENT,
					])
				: faker.helpers.arrayElement([
						TransactionCategory.PURCHASE,
						TransactionCategory.SALARY,
						TransactionCategory.OTHER,
					]);

		return {
			id: `transaction-${index + 1}`,
			type,
			amount: parseFloat(faker.finance.amount({ min: 50, max: 5000, dec: 2 })),
			category,
			description: faker.finance.transactionDescription(),
			date: faker.date.past({ years: 1 }).toISOString().split("T")[0],
			tenantId: "1",
			createdBy: "user-1",
			createdAt: faker.date.past({ years: 1 }).toISOString(),
			updatedAt: faker.date.recent().toISOString(),
		};
	});
};

// Generate Ministries
export const generateMinistries = (users: User[]): Ministry[] => {
	const ministryNames = [
		"Louvor e Adoração",
		"Mídia",
		"Recepção",
		"Escola Dominical",
		"Jovens",
		"Crianças",
		"Intercessão",
		"Evangelismo",
	];

	const leaders = users.filter(
		(u) => u.role === UserRole.LEADER || u.role === UserRole.ADMIN,
	);

	return ministryNames.map((name, index) => ({
		id: `ministry-${index + 1}`,
		name,
		description: faker.lorem.sentence(),
		leaderId: leaders[index % leaders.length]?.id || "user-1",
		members: faker.helpers.arrayElements(
			users.map((u) => u.id),
			{ min: 3, max: 10 },
		),
		tenantId: "1",
		createdAt: faker.date.past({ years: 1 }).toISOString(),
		updatedAt: faker.date.recent().toISOString(),
	}));
};

// Generate Events
export const generateEvents = (
	count: number = 50,
	users: User[],
	members: Member[],
): Event[] => {
	const statuses: EventStatus[] = [
		EventStatus.DRAFT,
		EventStatus.PUBLISHED,
		EventStatus.COMPLETED,
		EventStatus.CANCELLED,
	];

	const eventTitles = [
		"Culto de Celebração",
		"Escola Bíblica Dominical",
		"Culto de Oração",
		"Reunião de Jovens",
		"Retiro Espiritual",
		"Conferência Anual",
		"Vigília",
		"Evangelismo",
		"Culto de Libertação",
		"Café da Manhã",
	];

	return Array.from({ length: count }, (_, index) => {
		const eventDate = faker.date.between({
			from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
			to: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
		});

		const attendeeCount = faker.number.int({ min: 5, max: 50 });
		const attendees: EventAttendee[] = faker.helpers
			.arrayElements(members, attendeeCount)
			.map((member, idx) => ({
				id: `attendee-${index}-${idx}`,
				eventId: `event-${index + 1}`,
				memberId: member.id,
				member,
				checkedIn: faker.datatype.boolean(),
				checkedInAt: faker.helpers.maybe(() => eventDate.toISOString()),
				createdAt: faker.date.past().toISOString(),
			}));

		return {
			id: `event-${index + 1}`,
			title: faker.helpers.arrayElement(eventTitles),
			description: faker.lorem.paragraph(),
			date: eventDate.toISOString().split("T")[0],
			time: faker.date.recent().toTimeString().slice(0, 5),
			location: faker.location.streetAddress(),
			responsibleId: faker.helpers.arrayElement(users).id,
			attendees,
			maxAttendees: faker.helpers.maybe(() =>
				faker.number.int({ min: 50, max: 200 }),
			),
			status: faker.helpers.arrayElement(statuses),
			qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=event-${index + 1}`,
			tenantId: "1",
			createdAt: faker.date.past().toISOString(),
			updatedAt: faker.date.recent().toISOString(),
		};
	});
};

// Generate Schedules
export const generateSchedules = (
	count: number = 30,
	ministries: Ministry[],
	members: Member[],
): Schedule[] => {
	return Array.from({ length: count }, (_, index) => {
		const scheduleDate = faker.date.between({
			from: new Date(),
			to: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
		});

		const ministry = faker.helpers.arrayElement(ministries);
		const volunteerCount = faker.number.int({ min: 2, max: 6 });

		const volunteers: ScheduleVolunteer[] = faker.helpers
			.arrayElements(members, volunteerCount)
			.map((member, idx) => ({
				id: `schedule-volunteer-${index}-${idx}`,
				scheduleId: `schedule-${index + 1}`,
				memberId: member.id,
				member,
				status: faker.helpers.arrayElement([
					ScheduleStatus.PENDING,
					ScheduleStatus.CONFIRMED,
					ScheduleStatus.DECLINED,
				]),
				notifiedAt: faker.date.recent().toISOString(),
				respondedAt: faker.helpers.maybe(() =>
					faker.date.recent().toISOString(),
				),
			}));

		return {
			id: `schedule-${index + 1}`,
			title: `Escala ${ministry.name}`,
			description: faker.lorem.sentence(),
			date: scheduleDate.toISOString().split("T")[0],
			ministryId: ministry.id,
			ministry,
			volunteers,
			tenantId: "1",
			createdAt: faker.date.past().toISOString(),
			updatedAt: faker.date.recent().toISOString(),
		};
	});
};

// Generate all fake data
export const generateFakeData = () => {
	const tenant = generateTenant();
	const users = generateUsers(10);
	const members = generateMembers(100);
	const transactions = generateTransactions(200);
	const ministries = generateMinistries(users);
	const events = generateEvents(50, users, members);
	const schedules = generateSchedules(30, ministries, members);

	return {
		tenant,
		users,
		members,
		transactions,
		ministries,
		events,
		schedules,
	};
};

// Initialize fake data
export const fakeData = generateFakeData();

/**
 * Helper function to find or create a user by email for development
 * This allows authentication with ANY email while fake data is active
 */
export const findOrCreateUser = (email: string): User => {
	// Try to find existing user
	const existingUser = fakeData.users.find((u) => u.email === email);
	if (existingUser) {
		return existingUser;
	}

	// Create a new temporary user for this email
	const newUser: User = {
		id: `user-temp-${Date.now()}`,
		email,
		name: email.split("@")[0] || "Usuário Temporário",
		role: UserRole.ADMIN, // Give admin role for testing
		tenantId: "1",
		avatar: faker.image.avatar(),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	// Add to fake data (so subsequent requests work)
	fakeData.users.push(newUser);

	return newUser;
};
