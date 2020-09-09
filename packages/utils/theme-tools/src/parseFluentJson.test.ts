import baseJson from './fluentui.json';
import { parseFluentJson, FluentJson } from './parseFluentJson';
import { transformFluentJson } from './loadThemeInfo';

describe('Json parsing tests', () => {
  test('standard object is left unchanged', () => {
    const jsonObj: FluentJson = {
      Global: {
        Color: {
          Blue: { value: 'blue' },
          Red: { value: 'red' },
        },
      },
      Set: {
        MoreStuff: {
          Color: { aliasOf: 'Global.Color.Blue' },
        },
      },
    };
    expect(parseFluentJson(jsonObj)).toEqual(jsonObj);
  });

  test('fix alias indirection', () => {
    const jsonObj: FluentJson = {
      Global: {
        Color: {
          Base: { value: 'black' },
          Hover: { value: 'white' },
        },
      },
      Ref: {
        Fill: { aliasOf: 'Global.Color' },
      },
    };
    expect(parseFluentJson(jsonObj)).toEqual({
      Global: {
        Color: {
          Base: { value: 'black' },
          Hover: { value: 'white' },
        },
      },
      Ref: {
        Fill: {
          Base: { aliasOf: 'Global.Color.Base' },
          Hover: { aliasOf: 'Global.Color.Hover' },
        },
      },
    });
  });

  test('parse standard fluent json', () => {
    const parsed = parseFluentJson(baseJson);
    console.log(parsed);
    expect(parsed).not.toEqual(baseJson as any);
    expect(Object.keys(parsed.Global.Color.Blue).length).toEqual(Object.keys(parsed.Global.Color.Accent).length);
  });

  test('transform fluent json', () => {
    const parsed = parseFluentJson(baseJson);
    const transformed = transformFluentJson(parsed);
    console.log(transformed);
  });
});
