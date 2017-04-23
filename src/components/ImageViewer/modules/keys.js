function onLeftKeyDown({ currentImg, history, galleryId, modal }) {
  if (currentImg !== 1) {
    history.replace(`/${galleryId}/${currentImg - 1}`, { modal });
  }
}

function onRightKeyDown({ currentImg, images, history, galleryId, modal }) {
  if (currentImg !== images.length) {
    history.replace(`/${galleryId}/${currentImg + 1}`, { modal });
  }
}

function onEscKeyDown({ history }) {
  history.push('/');
}

export default function handlerKeyDown(props) {
  return (event) => {
    if (event.keyCode === 37) {
      onLeftKeyDown(props());
    }

    if (event.keyCode === 39) {
      onRightKeyDown(props());
    }

    if (event.keyCode === 27) {
      onEscKeyDown(props());
    }
  };
}
