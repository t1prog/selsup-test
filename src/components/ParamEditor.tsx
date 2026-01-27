import React from 'react';

export type ParamType = 'string' | 'number' | 'select';

export interface Param {
  id: number;
  name: string;
  type: ParamType;
}

export interface ParamValue {
  paramId: number;
  value: string;
}

export interface Color {
  id: number;
  name: string;
}

export interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}

export interface Props {
  params: Param[];
  model: Model;
}

export interface State {
  paramValues: Map<number, string>;
}

export class ParamsEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
}
