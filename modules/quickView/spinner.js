import React from 'react';
import { css } from 'react-emotion';

const spinner = css`
  display: block;
  margin: 3rem auto;
  -webkit-animation: spin infinite 1s linear;
  animation: spin infinite 1s linear;
  height: 5rem;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Spinner = () => (
  <img
    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE3LjA3JSIgeDI9Ijg2LjA4NCUiIHkxPSI3Ny4xMzklIiB5Mj0iMTEuMDI1JSI+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYiLz4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDA1NUE2Ii8+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSI2Ljk4NyUiIHgyPSIzOC43NzIlIiB5MT0iNzIuMzI5JSIgeTI9Ijg3Ljk4MSUiPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkVGRUZFIiBzdG9wLW9wYWNpdHk9IjAiLz4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDA1NUE2Ii8+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDwvZGVmcz4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utd2lkdGg9IjMiPgogICAgICAgIDxwYXRoIHN0cm9rZT0idXJsKCNhKSIgc3Ryb2tlLWRhc2hhcnJheT0iMSIgZD0iTTEwIDIwYzUuNTIzIDAgMTAtNC40NzcgMTAtMTBTMTUuNTIzIDAgMTAgMCAwIDQuNDc3IDAgMTBzNC40NzcgMTAgMTAgMTB6IiBvcGFjaXR5PSIuMiIgdHJhbnNmb3JtPSJyb3RhdGUoLTE4MCAxMSAxMSkiLz4KICAgICAgICA8cGF0aCBzdHJva2U9InVybCgjYikiIHN0cm9rZS1kYXNoYXJyYXk9IjUxLDI5MDAwMDk3MjgiIGQ9Ik0xMCAyMGM1LjUyMyAwIDEwLTQuNDc3IDEwLTEwUzE1LjUyMyAwIDEwIDAgMCA0LjQ3NyAwIDEwczQuNDc3IDEwIDEwIDEweiIgdHJhbnNmb3JtPSJyb3RhdGUoLTE4MCAxMSAxMSkiLz4KICAgIDwvZz4KPC9zdmc+Cg=="
    className={spinner}
    alt=""
  />
);

export default Spinner;
