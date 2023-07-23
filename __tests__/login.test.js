import React from 'react';
import renderer from 'react-test-renderer';
import AppButton from '../App/Signing_In/Button';


test('App button renders correctly', () => {
    const tree = renderer.create(<AppButton />).toJSON();
    expect(tree).toMatchSnapshot();
});