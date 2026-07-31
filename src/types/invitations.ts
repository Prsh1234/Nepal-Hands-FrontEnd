
export type InviteStatus = "pending" | "accepted" | "declined";

export type Invitation = {
  id: string;
  volunteerId: string;
  volunteerName: string;
  volunteerAvatar: string;
  opportunityId: string;
  opportunityTitle: string;
  organizerName: string;
  message: string;
  sentAt: string;
  status: InviteStatus;
  respondedAt?: string;
  responseNote?: string;
};
