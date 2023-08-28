import type { Participant } from '@pexip/plugin-api'

let user: Participant

export const setUser = (participant: Participant): void => {
  user = participant
}

export const getUser = (): Participant => {
  return user
}

/**
 * Adapt the participant to different version of Infinity. For v32 we received
 * the participant directly, but now we receive some like this for participantJoined,
 * participantLeft and me.
 * {
 *   "id": "main",
 *   "participant": {...}
 * }
 */
export const getCleanParticipant = (participant: any): Participant => {
  if (participant.uuid != null) {
    return participant
  } else {
    return (participant.participant as Participant)
  }
}
