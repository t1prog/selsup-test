import { useState, useRef } from 'react';
import './App.css';
import {
  ParamEditor,
  type Param,
  type Model,
  type ParamEditorHandle,
} from './components/ParamEditor';

const App = () => {
  const params: Param[] = [
    { id: 1, name: 'Назначение', type: 'string' },
    { id: 2, name: 'Длина', type: 'string' },
    { id: 3, name: 'Размер', type: 'string' },
  ];

  const initialModel: Model = {
    paramValues: [
      { paramId: 1, value: 'повседневное' },
      { paramId: 2, value: 'максимум' },
    ],
    colors: [
      { id: 1, name: 'Красный' },
      { id: 2, name: 'Синий' },
    ],
  };

  const [model, setModel] = useState<Model>(initialModel);
  const editorRef = useRef<ParamEditorHandle>(null);

  return (
    <div className="App">
      <header className="header">
        <h1>Редактор параметров товара</h1>
      </header>

      <div className="container">
        <section>
          <ParamEditor params={params} model={model} ref={editorRef} />
          <button
            onClick={() => {
              console.log(editorRef.current);

              if (editorRef.current) {
                const savedModel = editorRef.current.getModel();
                console.log('Модель:', savedModel);
                alert('Модель получена! Проверьте консоль.');
              }
            }}
          >
            Получить модель
          </button>
        </section>

        <section className="model-display">
          <h2>Текущая модель</h2>
          <pre>{JSON.stringify(model, null, 2)}</pre>
        </section>
      </div>
    </div>
  );
};

export default App;
