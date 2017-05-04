export function getEventPath(event) {
  if (event.nativeEvent.composedPath) {
    return event.nativeEvent.composedPath();
  }

  const path = [];
  let target = event.target;

  while (target.parentNode) {
    path.push(target);
    target = target.parentNode;
  }

  return path;
}
