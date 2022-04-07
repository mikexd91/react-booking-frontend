import { memo } from "react";
import styled from "styled-components";
import { Spin } from "antd";

const OverlaySpinnerContainer = styled.div`
  position: fixed; /* Sit on top of the page content */
  display: none; /* Hidden by default */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Black background with opacity */
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
`;

const CustomSpinner = styled(Spin)`
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 50px;
  color: white;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
`;

const OverlaySpinner = ({ isLoading }) => {
  return (
    <OverlaySpinnerContainer
      style={isLoading ? { display: "block" } : { display: "none" }}
    >
      <CustomSpinner spinning={isLoading}></CustomSpinner>
    </OverlaySpinnerContainer>
  );
};

export default memo(OverlaySpinner);
