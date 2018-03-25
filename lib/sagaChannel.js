import { eventChannel } from 'redux-saga'

export default function (ref, event = 'child_added') {
  const channel = eventChannel(function (emit) {
    const callback = ref.on(
      event,
      function (dataSnapshot) {
        return emit({
          key: dataSnapshot.key,
          value: dataSnapshot.val()
        })
      }
    )
    // Returns unsubscribe function
    return function () {
      return ref.off(event, callback)
    }
  })

  return channel
}
