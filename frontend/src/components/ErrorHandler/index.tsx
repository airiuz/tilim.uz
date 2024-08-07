import React, { ErrorInfo } from "react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ hasError: true });
    console.log(error, info);
  }

  render() {
    // if (this.state.hasError) {
    //   return <h1>Something went wrong.</h1>;
    // }
    return this.props.children;
  }
}

export default ErrorBoundary;
