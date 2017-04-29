export default function handlerKeyDown(navActions) {
  return (event) => {
    if (event.keyCode === 37) {
      navActions.prevImg();
    }

    if (event.keyCode === 39) {
      navActions.nextImg();
    }

    if (event.keyCode === 27) {
      navActions.close();
    }
  };
}
