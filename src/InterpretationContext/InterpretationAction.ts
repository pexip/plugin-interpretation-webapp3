enum InterpretationActionType {
  Connecting,
  Connected,
  Disconnected,
  ChangedLanguage,
  ChangedDirection,
  ChangedMute,
  Minimize
}

interface InterpretationAction {
  type: InterpretationActionType
  body?: any
}

export { InterpretationActionType }
export type { InterpretationAction }
