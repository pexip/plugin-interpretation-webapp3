import { setMainConferenceAlias } from './conference'
import { getPlugin } from './plugin'
import { getCleanParticipant, setUser } from './user'

interface AuthenticatedWithConferenceEvent {
  conferenceAlias: string
}

export const initializeEvents = (): void => {
  const plugin = getPlugin()
  plugin.events.authenticatedWithConference.add(handleAuthenticatedWithConference)
  plugin.events.me.add(handleMe)
}

const handleAuthenticatedWithConference = (event: AuthenticatedWithConferenceEvent): void => {
  setMainConferenceAlias(event.conferenceAlias)
}

const handleMe = (participant: any): void => {
  setUser(getCleanParticipant(participant))
}
