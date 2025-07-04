import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import { KEY_CODES } from '@utils';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledEducationSection = styled.section`
  max-width: 700px;
  .inner {
    display: flex;
    flex-direction: column;
    @media (max-width: 600px) {
      display: block;
    }
    @media (min-width: 700px) {
      min-height: 340px;
    }
  }
`;
const StyledTabList = styled.div`
  display: flex;
  overflow-x: auto;
  width: 100%;
  padding: 0;
  margin: 0 0 30px 0;
  list-style: none;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  justify-content: flex-start;
`;
const StyledTabButton = styled.button`
  ${({ theme }) => theme.mixins.link};
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-width: 140px;
  height: var(--tab-height);
  padding: 0 16px;
  border: none;
  background: transparent;
  color: ${({ isActive }) => (isActive ? 'var(--green)' : 'var(--slate)')};
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  text-align: left;
  white-space: nowrap;
  &:hover,
  &:focus {
    background-color: var(--light-navy);
  }
`;
const StyledHighlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 2px;
  height: var(--tab-height);
  border-radius: var(--border-radius);
  background: var(--green);
  transform: translateY(calc(${({ activeTabId }) => activeTabId} * var(--tab-height)));
  transition: transform 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition-delay: 0.1s;
  @media (max-width: 600px) {
    top: auto;
    bottom: 0;
    width: 100%;
    max-width: var(--tab-width);
    height: 2px;
    margin-left: 50px;
    transform: translateX(calc(${({ activeTabId }) => activeTabId} * var(--tab-width)));
  }
  @media (max-width: 480px) {
    margin-left: 25px;
  }
`;
const StyledTabPanels = styled.div`
  position: relative;
  width: 100%;
  margin-left: 20px;
  @media (max-width: 600px) {
    margin-left: 0;
  }
`;
const StyledTabPanel = styled.div`
  width: 100%;
  height: auto;
  padding: 10px 5px;
  ul {
    ${({ theme }) => theme.mixins.fancyList};
  }
  h3 {
    margin-bottom: 2px;
    font-size: var(--fz-xxl);
    font-weight: 500;
    line-height: 1.3;
    .company {
      color: var(--green);
    }
  }
  .range {
    margin-bottom: 25px;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }
`;

const Education = () => {
  const data = useStaticQuery(graphql`
    query {
      education: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/education/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              school
              location
              range
              url
            }
            html
          }
        }
      }
    }
  `);

  const educationData = data.education.edges;
  const [activeTabId, setActiveTabId] = useState(0);
  const [tabFocus, setTabFocus] = useState(null);
  const tabs = useRef([]);
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    sr.reveal(revealContainer.current, srConfig());
  }, []);

  // Tab focus logic (copied from Jobs)
  const focusTab = () => {
    if (tabs.current[tabFocus]) {
      tabs.current[tabFocus].focus();
      return;
    }
    if (tabFocus >= tabs.current.length) {
      setTabFocus(0);
    }
    if (tabFocus < 0) {
      setTabFocus(tabs.current.length - 1);
    }
  };

  useEffect(() => focusTab(), [tabFocus]);

  const onKeyDown = e => {
    switch (e.key) {
      case KEY_CODES.ARROW_UP: {
        e.preventDefault();
        setTabFocus(tabFocus - 1);
        break;
      }
      case KEY_CODES.ARROW_DOWN: {
        e.preventDefault();
        setTabFocus(tabFocus + 1);
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <StyledEducationSection id="education" ref={revealContainer}>
      <h2 style={{fontSize: 'clamp(26px,5vw,var(--fz-heading))', color: 'var(--lightest-slate)', fontFamily: 'var(--font-sans)', fontWeight: 600, marginBottom: '40px'}}>Where I Studied</h2>
      <div className="inner">
        <StyledTabList role="tablist" aria-label="Education tabs" onKeyDown={e => onKeyDown(e)}>
          <ul>
            {educationData &&
              educationData.map(({ node }, i) => {
                const { school } = node.frontmatter;
                return (
                  <li key={i}>
                    <StyledTabButton
                      ref={el => (tabs.current[i] = el)}
                      onClick={() => setActiveTabId(i)}
                      isActive={activeTabId === i}
                      role="tab"
                      tabIndex={activeTabId === i ? 0 : -1}
                      aria-selected={activeTabId === i}
                      aria-controls={`panel-${i}`}
                      id={`tab-${i}`}
                    >
                      {school}
                    </StyledTabButton>
                  </li>
                );
              })}
          </ul>
          <StyledHighlight activeTabId={activeTabId} />
        </StyledTabList>
        <StyledTabPanels>
          {educationData &&
            educationData.map(({ node }, i) => {
              const { title, school, range, url } = node.frontmatter;
              return (
                <CSSTransition
                  key={i}
                  in={activeTabId === i}
                  timeout={250}
                  classNames="fade"
                  unmountOnExit
                >
                  <StyledTabPanel
                    id={`panel-${i}`}
                    role="tabpanel"
                    tabIndex={0}
                    aria-labelledby={`tab-${i}`}
                    hidden={activeTabId !== i}
                  >
                    <h3>
                      <span>{title}</span>
                      <span className="company">
                        &nbsp;@&nbsp;
                        <a href={url} className="inline-link">
                          {school}
                        </a>
                      </span>
                    </h3>
                    <p className="range">{range}</p>
                    <div dangerouslySetInnerHTML={{ __html: node.html }} />
                  </StyledTabPanel>
                </CSSTransition>
              );
            })}
        </StyledTabPanels>
      </div>
    </StyledEducationSection>
  );
};

export default Education; 