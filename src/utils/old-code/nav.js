import React, { Component } from "react";
import { NavLink,withRouter } from "react-router-dom";
import { navLinks, navHeight } from "../../config"
import { throttle } from "../../utils"
import styled from "styled-components";
import { theme,media,mixins } from "../../styles"
import { getAccessToken } from "../../helpers/accessToken";
const { colors, fontSizes, fonts } = theme;

const StyledContainer = styled.div`
${mixins.flexBetween}
  position:fixed;
  top: 0;
  padding: 0px 50px;
  background-color:transparent;
  z-index: 11;
  filter: none !important;
  pointer-events: auto !important;
  user-select: auto !important;
  width: 100%;
  height: ${(props) =>
    props.scrollDirection === "none" ? theme.navHeight : theme.navScrollHeight};
  transform: translateY(
    ${(props) =>
      props.scrollDirection === "down" ? `-${theme.navScrollHeight}` : "0"}
  ) ;
  /* box-shadow: 0px -1px 26px 4px ${colors.mediumBlue}; */
  color: ${colors.navy};
  ${media.desktop`padding:0 40px;`}
  ${media.tablet`padding: 0 40px;`}

  /* transform: translateY(0) translateZ(0); */
  transition: transform .25s cubic-bezier(.45,.05,.55,.95) 0ms,background-color .25s cubic-bezier(.45,.05,.55,.95) 0ms,-webkit-transform .25s cubic-bezier(.45,.05,.55,.95) 0ms;
  
`;

const StyledNav = styled.div`
  ${mixins.flexBetween}
  position: relative;
  width: 100%;
  color: ${colors.lightestSlate};
  font-family: ${fonts.SFMono};
  counter-reset: item 0;
  z-index: 12;
`;

const StyledLogo = styled.div`
  ${mixins.flexCenter}
color: ${colors.dark};
  a {
    font-weight: bold;
    display: block;
    color: ${colors.dark};
    width: 42px;
    height: 42px;
    &:hover,
    &:focus {
      svg {
        fill: ${colors.transGreen};
      }
    }
    svg {
      fill: none;
      transition: ${theme.transition};
      user-select: none;
    }
  }
`;

const StyledLink = styled.div`
  display: flex;
  align-items: center;
  ${media.desktop`display: none;`};
`;

const StyledList = styled.ol`
  ${mixins.flexBetween};
  padding: 0;
  margin: 0;
  list-style: none;
`;

const StyledListItem = styled.li`
  position: relative;
  font-size: ${fontSizes.smish};
  counter-increment: item 1;
  transition: ${theme.transition};
  padding: 0px 20px;

  a {
    display: inline-block;
    padding: 0px 20px;
    font-size: 13px;
    color: ${colors.navy};
    font-family: ${fonts.HK};
    text-transform: uppercase;
  }
  a:hover {
    color: ${colors.celeste};

    /* border: 0.5px solid ${colors.lightGrey}; */
  }
  .active {
    color: ${colors.celeste};
  }
`;

const StyledHamburguer = styled.div`
  ${mixins.flexCenter}
  /* border:1px solid red; */
  margin: 0 -12px 0 0;
  padding: 15px;
  overflow: visible;
  cursor: pointer;
  text-transform: none;
  color: ${colors.navy};
  border: 0;
  background-color: transparent;
  display: none;
  transition-timing-function: linear;
  transition-duration: 0.15s;
  transition-property: opacity, filter;
  ${media.desktop`display: flex;`};
`;

const StyledhaburguerBox = styled.div`
  position: relative;
  display: inline-block;
  width: ${theme.hamburgerWidth}px;
  height: 24px;
`;

const StyledHamburguerInner = styled.div`
  background-color: ${colors.green};
  position: absolute;
  width: ${theme.hamburgerWidth}px;
  height: 2px;
  border-radius: ${theme.borderRadius};
  top: 50%;
  left: 0;
  right: 0;
  transition-duration: 0.22s;
  transition-property: transform;
  transition-delay: ${(props) => (props.menuOpen ? `0.12s` : `0s`)};
  transform: rotate(${(props) => (props.menuOpen ? `225deg` : `0deg`)});
  transition-timing-function: cubic-bezier(
    ${(props) =>
      props.menuOpen ? `0.215, 0.61, 0.355, 1` : `0.55, 0.055, 0.675, 0.19`}
  );
  &:before,
  &:after {
    content: "";
    display: block;
    background-color: ${colors.green};
    position: absolute;
    left: auto;
    right: 0;
    width: ${theme.hamburgerWidth}px;
    height: 2px;
    transition-timing-function: ease;
    transition-duration: 0.15s;
    transition-property: transform;
    border-radius: 4px;
  }
  &:before {
    width: ${(props) => (props.menuOpen ? `100%` : `120%`)};
    top: ${(props) => (props.menuOpen ? `0` : `-10px`)};
    opacity: ${(props) => (props.menuOpen ? 0 : 1)};
    transition: ${(props) =>
      props.menuOpen ? theme.hamBeforeActive : theme.hamBefore};
  }
  &:after {
    width: ${(props) => (props.menuOpen ? `100%` : `80%`)};
    bottom: ${(props) => (props.menuOpen ? `0` : `-10px`)};
    transform: rotate(${(props) => (props.menuOpen ? `-90deg` : `0`)});
    transition: ${(props) =>
      props.menuOpen ? theme.hamAfterActive : theme.hamAfter};
  }
`;

const DELTA = 5;

class Navbar extends Component {
  state = {
    menuOpen: false,
    scrollDirection: "none",
    isHome: this.isHome(window.location.pathname),
    isMounted: !this.isHome,
    isLogged:this.props.isAuth
  };

  componentWillMount(){
    this.setState({isLogged:getAccessToken()})
  }
  componentDidMount() {
      console.log("navbar did mount")
    
    setTimeout(() => {
      this.setState(
        { isMounted: true },
        () => {
          window.addEventListener("scroll", () =>
            throttle(this.handleScroll())
          );
          window.addEventListener("resize", () =>
            throttle(this.handleResize())
          );
        },
        100
      );
    });
  }

  
  componentWillUnmount() {
    window.removeEventListener("scroll", () => this.handleScroll());
    window.removeEventListener("resize", () => this.handleResize());
  }

  isHome(url) {
    return url === "/" ? true : false;
  }
  toggleMenu = () => this.setState({ menuOpen: !this.state.menuOpen });

  handleResize = () => {
    if (window.innerWidth > 1000 && this.state.menuOpen) {
      this.toggleMenu();
    }
  };

  handleScroll = () => {
    const { isMounted, menuOpen, scrollDirection, lastScrollTop } = this.state;
    const fromTop = window.scrollY;

    // Make sure they scroll more than DELTA
    if (!isMounted || Math.abs(lastScrollTop - fromTop) <= DELTA || menuOpen) {
      return;
    }

    if (fromTop < DELTA) {
      this.setState({ scrollDirection: "none" });
    } else if (fromTop > lastScrollTop && fromTop > navHeight) {
      if (scrollDirection !== "down") {
        this.setState({ scrollDirection: "down" });
      }
    } else if (fromTop + window.innerHeight < document.body.scrollHeight) {
      if (scrollDirection !== "up") {
        this.setState({ scrollDirection: "up" });
      }
    }

    this.setState({ lastScrollTop: fromTop });
  };

  

  render() {
    const { isMounted, menuOpen, scrollDirection,isLogged } = this.state;

    // this.setState({isLogged:getAccessToken()})
    console.log("before",getAccessToken())
    if(!getAccessToken()){
        console.log("render",isLogged)
        return(<div>NO navbar</div>)
    }
    else{
        console.log("render2",getAccessToken())
    return (
        
        <StyledContainer scrollDirection={scrollDirection}>
        {/* <Helmet>
          <body className={menuOpen ? "blur" : ""} />
        </Helmet> */}
        <StyledNav>
          {/* LOGO */}
          <StyledLogo>COVICLEAN EC</StyledLogo>

          {/* TOGGLE BUTTON */}

          <StyledHamburguer onClick={this.toggleMenu}>
            <StyledhaburguerBox>
              <StyledHamburguerInner menuOpen={menuOpen} />
            </StyledhaburguerBox>
          </StyledHamburguer>

          {/* LINKS */}

          <StyledLink>
            <StyledList>
              {navLinks.map(({ url, name }, index) => {
                const isHome = this.isHome(url);
                return (
                  <StyledListItem key={index}>
                    <NavLink exact={isHome} to={url}>
                      {name}
                    </NavLink>
                  </StyledListItem>
                );
              })}
            </StyledList>
          </StyledLink>
        </StyledNav>
      </StyledContainer>
            
      );
            }
  }
}

export default withRouter(Navbar);
