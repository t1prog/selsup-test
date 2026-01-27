import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ParamEditor, type Param, type Model } from './ParamEditor';

describe('ParamEditor', () => {
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

  // Тест 1 Отображение полей по params
  it('should render all params from props', () => {
    render(<ParamEditor params={params} model={initialModel} />);

    // Проверяем что все поля отображаются
    expect(screen.getByText('Назначение:')).toBeInTheDocument();
    expect(screen.getByText('Длина:')).toBeInTheDocument();
    expect(screen.getByText('Размер:')).toBeInTheDocument();

    // Проверяем, что есть 3 инпута
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(3);
  });

  // Тест 2: Корректная инициализация из model.paramValues
  it('should initialize input values from model.paramValues', () => {
    render(<ParamEditor params={params} model={initialModel} />);

    // Проверяем значения инпутов из модели
    const inputs = screen.getAllByRole('textbox');

    expect(inputs[0]).toHaveValue('повседневное'); // Назначение
    expect(inputs[1]).toHaveValue('максимум'); // Длина
    expect(inputs[2]).toHaveValue(''); // Размер (нет в модели)
  });

  // Тест 3 Корректный результат getModel() после изменений
  it('should return correct model after changes via ref', () => {
    // Создаем мок-реф
    const ref = {
      current: null as any,
    };

    render(<ParamEditor params={params} model={initialModel} ref={ref} />);

    // Изменяем значения в инпутах
    const inputs = screen.getAllByRole('textbox');

    fireEvent.change(inputs[0], { target: { value: 'новое назначение' } });
    fireEvent.change(inputs[1], { target: { value: 'средняя' } });
    fireEvent.change(inputs[2], { target: { value: 'M' } });

    // Вызываем getModel() через реф
    const result = ref.current?.getModel();

    expect(result).toEqual({
      paramValues: [
        { paramId: 1, value: 'новое назначение' },
        { paramId: 2, value: 'средняя' },
        { paramId: 3, value: 'M' },
      ],
      colors: [
        { id: 1, name: 'Красный' },
        { id: 2, name: 'Синий' },
      ],
    });
  });

  it('should call onModelChange when inputs change', () => {
    const onModelChange = vi.fn();

    render(
      <ParamEditor
        params={params}
        model={initialModel}
        onModelChange={onModelChange}
      />,
    );

    const inputs = screen.getAllByRole('textbox');

    // Изменяем первый инпут
    fireEvent.change(inputs[0], { target: { value: 'обновленное' } });

    // Проверяем что колбэк вызвался
    expect(onModelChange).toHaveBeenCalled();

    // Проверяем что передалась правильная модель
    const calledModel = onModelChange.mock.calls[0][0];
    expect(calledModel.paramValues).toContainEqual({
      paramId: 1,
      value: 'обновленное',
    });
  });

  // Тест 5 Пустые значения для параметров, которых нет в model
  it('should have empty values for params not in model', () => {
    render(<ParamEditor params={params} model={initialModel} />);

    const inputs = screen.getAllByRole('textbox');

    // Параметр "Размер" id 3 нет в начальной модели
    expect(inputs[2]).toHaveValue('');
  });

  // Тест 6 Структура возвращаемой модели
  it('should return model with correct structure', () => {
    const ref = {
      current: null as any,
    };

    render(<ParamEditor params={params} model={initialModel} ref={ref} />);

    const result = ref.current?.getModel();

    // Проверяем структуру
    expect(result).toHaveProperty('paramValues');
    expect(result).toHaveProperty('colors');
    expect(Array.isArray(result.paramValues)).toBe(true);
    expect(Array.isArray(result.colors)).toBe(true);

    // Проверяем что все поля присутствуют
    expect(result.paramValues).toHaveLength(2);
  });
});
