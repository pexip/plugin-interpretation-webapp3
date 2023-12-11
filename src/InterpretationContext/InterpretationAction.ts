enum InterpretationActionType {
  Connecting,
  Connected,
  Disconnected,
  ChangedLanguage,
  ChangedDirection,
  ChangedMute,
  ChangedVolume,
  Minimize
}

interface InterpretationAction {
  type: InterpretationActionType
  body?: any
}

export { InterpretationActionType }
export type { InterpretationAction }
