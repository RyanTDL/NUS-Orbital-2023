import React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react-native';
import Welcome from '../App/Signing_In/Welcome';
import AppButton from '../App/Signing_In/Button';
import SignUp from '../App/Signing_In/SignUp';


describe('Testing Signing In Pages', () => {

    test('Welcome Page renders correctly', () => {
        const tree = renderer.create(<Welcome />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    test('AppButton renders correctly', () => {
        const tree = renderer.create(<AppButton />).toJSON();
        expect(tree).toMatchSnapshot();
    });
    
    test('Log In button is called', () => {
        const onPressMock = jest.fn();
        const navigation = { replace: jest.fn() }; // Mock the navigation object with the replace function
        const { getByText } = render(
            <AppButton
                title="Log In"
                onPress={onPressMock}
                buttonStyle={{}}
                textStyle={{}}
                navigation={navigation}
            />
        );
    
        const button = getByText('Log In');
        fireEvent.press(button);
        expect(onPressMock).toHaveBeenCalled();
    });

    test('Sign Up button is called', () => {
        const onPressMock = jest.fn();
        const navigation = { replace: jest.fn() }; // Mock the navigation object with the replace function
        const { getByText } = render(
            <AppButton
                title="Sign Up"
                onPress={onPressMock}
                buttonStyle={{}}
                textStyle={{}}
                navigation={navigation}
            />
        );
    
        const button = getByText('Sign Up');
        fireEvent.press(button);
        expect(onPressMock).toHaveBeenCalled();
    });
})

