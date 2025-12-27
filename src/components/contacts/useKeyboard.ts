import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

type KeyboardState = {
  visible: boolean;
  height: number;
};

function useKeyboard(): KeyboardState {
  const [state, setState] = useState<KeyboardState>({ visible: false, height: 0 });

  useEffect(() => {
    const onShow = (e: KeyboardEvent) => {
      setState({ visible: true, height: e.endCoordinates?.height ?? 0 });
    };
    const onHide = () => {
      setState({ visible: false, height: 0 });
    };

    const subShow = Keyboard.addListener('keyboardDidShow', onShow);
    const subHide = Keyboard.addListener('keyboardDidHide', onHide);

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

  return state;
}

export default useKeyboard;
