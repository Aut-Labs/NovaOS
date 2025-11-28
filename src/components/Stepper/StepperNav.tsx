import { pxToRem } from "@utils/text-size";
import { Fragment } from "react";
import SmCircle from "@assets/aut/small-icon.svg?react";
import LgCircle from "@assets/aut/icon.png";
import { SvgIcon, Typography, styled } from "@mui/material";
import { StepperNavProps } from "./model";

const DotActive = styled(SvgIcon)<any>(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    width: "70px",
    height: "70px"
  },
  [theme.breakpoints.up("lg")]: {
    width: "105px",
    height: "105px"
  },
  [theme.breakpoints.up("xxl")]: {
    width: "125px",
    height: "125px"
  },
  borderRadius: "50%",
  background: `url(${SmCircle})`,
  zIndex: 3
}));

const DotInActive = styled<any>(SvgIcon)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    width: "40px",
    height: "40px"
  },
  [theme.breakpoints.up("lg")]: {
    width: "60px",
    height: "60px"
  },
  [theme.breakpoints.up("xxl")]: {
    width: "75px",
    height: "75px"
  },
  borderRadius: "50%",
  background: `url(${SmCircle})`,
  zIndex: 2
}));

const NavWrapper = styled("div")({
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  width: pxToRem(950),
  margin: "0 auto"
});

const DotWrapper = styled("div")(({ theme }) => ({
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  flexDirection: "column",
  minHeight: pxToRem(80),
  position: "relative",
  width: "100%",
  "&::before": {
    content: `" "`,
    position: "absolute",
    width: "108%",
    backgroundColor: theme.palette.offWhite.main,
    height: "2px",
    zIndex: -1
  }
}));

const StepperNav = (props: StepperNavProps) => {
  const dots = props.steps.map((step, index) => {
    const stepNumber = index + 1;
    const isActive = props.currentStep === stepNumber;
    const isComplete = props.currentStep > stepNumber;
    const { title } = step;

    return (
      <Fragment key={`nav-step-top-${stepNumber}`}>
        <span
          key={`nav-step-${stepNumber}`}
          onClick={() => isComplete && props.goToStep(stepNumber)}
        >
          {(isActive || isComplete) && (
            <DotActive
              key={`nav-active-dot-${stepNumber}`}
              component={LgCircle}
              inheritViewBox
            />
          )}
          {!isActive && !isComplete && (
            <DotInActive
              key={`nav-inactive-dot-${stepNumber}`}
              component={SmCircle}
              inheritViewBox
            />
          )}
          {/* <Dot key={`nav-dot-${stepNumber}`} isActive={isActive} title={title || " "}>
            <DotInner component={SmCircle} inheritViewBox />
          </Dot> */}
        </span>
        {/* {props.totalSteps !== stepNumber && (
          <StepperLine key={`nav-stepper-line-${stepNumber}`} />
        )} */}
      </Fragment>
    );
  });

  return (
    <NavWrapper>
      <DotWrapper>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          {dots}
        </div>
      </DotWrapper>
      {props.steps[props.currentStep - 1].description && (
        <Typography
          variant="body"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: pxToRem(30),
            mb: pxToRem(80),
            color: "offWhite.main",
            maxWidth: "85%"
          }}
        >
          {props.steps[props.currentStep - 1].description}
        </Typography>
      )}
    </NavWrapper>
  );
};

export default StepperNav;
