import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

const Barcode = ({
  value,
  format,
  width,
  height,
  displayValue = true,
  text,
  fontOptions,
  font,
  textAlign,
  textPosition,
  textMargin,
  fontSize,
  background,
  lineColor,
  margin,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  flat,
  ean128,
  elementTag = "svg",
}) => {
  const barcodeRef = useRef(null);

  useEffect(() => {
    const settings = {
      format,
      width,
      height,
      displayValue,
      text,
      fontOptions,
      font,
      textAlign,
      textPosition,
      textMargin,
      fontSize,
      background,
      lineColor,
      margin,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      flat,
      ean128,
      valid: (valid) => {
        // Handle valid state if needed
      },
      elementTag,
    };

    removeUndefinedProps(settings);
    JsBarcode(barcodeRef.current, value, settings);
  }, [
    value,
    format,
    width,
    height,
    displayValue,
    text,
    fontOptions,
    font,
    textAlign,
    textPosition,
    textMargin,
    fontSize,
    background,
    lineColor,
    margin,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    flat,
    ean128,
    elementTag,
  ]);

  const removeUndefinedProps = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === undefined) {
        delete obj[key];
      }
    });
  };

  return React.createElement(elementTag, { ref: barcodeRef });
};

export default Barcode;
