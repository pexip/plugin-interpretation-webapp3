import { setMainConferenceAlias } from './conference'
import { MainRoomVolume } from './main-room/volume'
import { getPlugin } from './plugin'
import { getCleanParticipant, setUser } from './user'
import type { InterpretationContextType } from './InterpretationContext/InterpretationContext'

interface AuthenticatedWithConferenceEvent {
  conferenceAlias: string
}

let interpretationContext: InterpretationContextType

export const refreshContextEvents = (context: InterpretationContextType): void => {
  interpretationContext = context
}

export const initializeEvents = (): void => {
  const plugin = getPlugin()
  plugin.events.authenticatedWithConference.add(handleAuthenticatedWithConference)
  plugin.events.me.add(handleMe)
  plugin.events.participants.add(handleParticipants)
  plugin.events.disconnected.add(handleDisconnected)
}

const handleAuthenticatedWithConference = (event: AuthenticatedWithConferenceEvent): void => {
  setMainConferenceAlias(event.conferenceAlias)
}

const handleMe = (participant: any): void => {
  setUser(getCleanParticipant(participant))
}

const handleParticipants = (): void => {
  // Reset the volume in the video HTML element. This is needed because the web
  // app can re-create the element when a new participant joins.
  MainRoomVolume.refresh()
}

const handleDisconnected = async (): Promise<void> => {
  await interpretationContext.disconnect()
}
