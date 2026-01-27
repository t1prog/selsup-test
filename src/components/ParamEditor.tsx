import React, { forwardRef, useImperativeHandle, useState } from 'react';

export type ParamType = 'string';

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
  onModelChange?: (model: Model) => void;
}

export interface State {
  paramValues: Map<number, string>;
}

export interface ParamInputProps {
  param: Param;
  value: string;
  onChange: (value: string) => void;
}

export const ParamInput: React.FC<ParamInputProps> = ({
  param,
  value,
  onChange,
}) => {
  // Как можно расширить

  // if (param.type === 'string' || param.type === 'number') {
  //   return (
  //     <input
  //       type={param.type === 'number' ? 'number' : 'text'}
  //       value={value}
  //       onChange={(e) => {
  //         onChange(e.target.value);
  //       }}
  //       placeholder={`Введите ${param.name}`}
  //       className="param-input"
  //     />
  //   );
  // }

  // Возвращаем по дефолту
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Введите ${param.name}`}
      className="param-input"
    />
  );
};

export interface ParamEditorHandle {
  getModel: () => Model;
}

export const ParamEditor = forwardRef<ParamEditorHandle, Props>(
  ({ params, model, onModelChange }, ref) => {
    const [paramValues, setParamValues] = useState<Map<number, string>>(() => {
      const map = new Map<number, string>();
      model.paramValues.forEach((pv) => map.set(pv.paramId, pv.value));
      return map;
    });

    const handleParamChange = (paramId: number, value: string) => {
      setParamValues((prev) => {
        const newMap = new Map(prev);
        newMap.set(paramId, value);

        const newModel: Model = {
          paramValues: Array.from(newMap.entries()).map(([paramId, value]) => ({
            paramId,
            value,
          })),
          colors: [...model.colors],
        };

        onModelChange?.(newModel);

        return newMap;
      });
    };

    useImperativeHandle(
      ref,
      () => ({
        getModel: () => ({
          paramValues: Array.from(paramValues.entries()).map(
            ([paramId, value]) => ({ paramId, value }),
          ),
          colors: [...model.colors],
        }),
      }),
      [paramValues, model.colors],
    );

    return (
      <div className="param-editor">
        <h2>Редактор параметров</h2>
        {params.map((param) => (
          <div key={param.id} className="param-row">
            <label className="param-label">
              {param.name}:
              <ParamInput
                param={param}
                value={paramValues.get(param.id) || ''}
                onChange={(value) => handleParamChange(param.id, value)}
              />
            </label>
          </div>
        ))}
      </div>
    );
  },
);
