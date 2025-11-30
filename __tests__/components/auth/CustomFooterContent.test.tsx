import FooterContent from '@/src/components/auth/CustomFooterContent';
import { render, fireEvent } from '@testing-library/react-native';
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('FooterContent', () => {
  it('renders text and boldText correctly', () => {
    const { getByText } = render(
      <FooterContent
        text="Already have an account?"
        boldText="SignIn"  
        linkTo="SignIn"
      />
    );

    expect(getByText('Already have an account?')).toBeTruthy();
    expect(getByText('SignIn')).toBeTruthy();  
  });

  it('calls navigation.navigate when boldText pressed', () => {
    const { getByText } = render(
      <FooterContent
        text="Already have an account?"
        boldText="SignIn"
        linkTo="SignIn"
      />
    );

    fireEvent.press(getByText('SignIn'));
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('SignIn');
  });
});
