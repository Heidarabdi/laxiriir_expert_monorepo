export type ExpertCategory = "Strategy" | "Tech" | "Medical" | "Design";

export type AvailabilityWindow = "today" | "week";

export interface BookingSlot {
	id: string;
	startsAt: string;
	timeLabel: string;
	available: boolean;
}

export interface BookingDay {
	id: string;
	dayLabel: string;
	dateLabel: string;
	isToday?: boolean;
	slots: BookingSlot[];
}

export interface SessionOffer {
	id: string;
	label: string;
	durationMinutes: number;
	price: number;
	description: string;
}

export interface ExpertExperienceItem {
	year: string;
	title: string;
	company: string;
	description: string;
}

export interface ExpertReviewItem {
	id: string;
	text: string;
	author: string;
	authorTitle: string;
}

export interface ExpertProfile {
	id: string;
	name: string;
	title: string;
	category: ExpertCategory;
	rating: number;
	reviewsCount: number;
	image: string;
	shortBio: string;
	bio: string[];
	tags: string[];
	languages: string[];
	responseTime: string;
	verificationNote: string;
	nextSlot: string;
	sessionOffers: SessionOffer[];
	availabilityMonth: string;
	bookingDays: BookingDay[];
	experience: ExpertExperienceItem[];
	reviews: ExpertReviewItem[];
}

export type BookingStatus = "confirmed" | "cancelled";

export interface BookingRecord {
	id: string;
	bookedAt: string;
	dateLabel: string;
	dayLabel: string;
	durationMinutes: number;
	expertId: string;
	expertImage: string;
	expertName: string;
	expertTitle: string;
	offerId: string;
	offerLabel: string;
	price: number;
	slotId: string;
	startsAt: string;
	status: BookingStatus;
	timeLabel: string;
}
