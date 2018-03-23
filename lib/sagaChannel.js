import { eventChannel } from 'redux-saga'

export default function (ref, event = 'child_added') {
  const channel = eventChannel(emit => {
    const callback = ref.on(
      event,
      dataSnapshot => emit({
        key: dataSnapshot.key,
        value: dataSnapshot.val()
      })
    )
    // Returns unsubscribe function
    return () => ref.off(event, callback)
  })

  return channel
}
