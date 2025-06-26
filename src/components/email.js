import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { email } from '@config';
import { Side } from '@components';

const StyledLinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  bottom: 0;
  right: 0;
  width: 40px;
  z-index: 10;
  color: var(--light-slate);

  &:after {
    content: '';
    display: block;
    width: 1px;
    height: 90px;
    margin: 0 auto;
    background-color: var(--light-slate);
  }

  a {
    margin: 20px auto;
    padding: 10px 0;
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.5;
    letter-spacing: 0.1em;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    color: inherit;
    transition: var(--transition);
    &:hover,
    &:focus {
      color: var(--green);
      transform: translateY(-3px);
    }
  }

  @media (max-width: 768px) {
    width: 32px;
    font-size: 12px;
    right: 0;
    bottom: 0;
    a {
      padding: 8px 0;
      font-size: 12px;
    }
  }
`;

const Email = ({ isHome }) => (
  <Side isHome={isHome} orientation="right">
    <StyledLinkWrapper>
      <a href={`mailto:${email}`}>{email}</a>
    </StyledLinkWrapper>
  </Side>
);

Email.propTypes = {
  isHome: PropTypes.bool,
};

export default Email;
