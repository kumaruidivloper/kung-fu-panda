import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import { css } from 'react-emotion';
import Link from '@academysports/fusion-components/dist/Link';
import ReactDOM from 'react-dom';
import { compose } from 'redux';
import { Provider, connect } from 'react-redux';
import { NODE_TO_MOUNT, DATA_COMP_ID, CHECKBALANCE } from './constants';
// import bulkIcon from '../../assets/images/gift-card-bulk-blu.svg';import checkIcon from '../../assets/images/gift-card-check-blu.svg';
// import mailIcon from '../../assets/images/gift-card-mail-blu.svg';

const mailIcon =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIwLjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MDAgNTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MDAgNTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzBCNTdBNztzdHJva2U6IzBGNThBNjtzdHJva2Utd2lkdGg6NztzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cjwvc3R5bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik05Mi4yLDMzNy4yYy02LjEsMC0xMi4zLDAtMTguNCwwYy01LjksMC05LjUtMy05LjYtNy44Yy0wLjEtNC44LDMuNi04LDkuMy04LjFjMTIuNiwwLDI1LjIsMCwzNy45LDAKCWM1LjgsMCw5LjQsMy4yLDkuMyw4Yy0wLjEsNC43LTMuOCw3LjgtOS42LDcuOEMxMDQuOCwzMzcuMiw5OC41LDMzNy4yLDkyLjIsMzM3LjJ6Ii8+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMDYuNCw4OS42YzAtNy45LDAtMTUuOCwwLTIzLjdjNS45LDAsMTEuOCwwLDE3LjcsMHYwYzEyLjgsMCwyNS44LDAsMzksMHYwYzEyLjgsMCwyNS43LDAsMzguOSwwCgljMCw4LDAsMTUuOSwwLDIzLjdIMjE4YzAtMTAsMC0yMCwwLTMwYzAtNy40LTIuNi0xMC05LjgtMTBjLTE1LjYsMC0zMS4yLDAtNDYuOCwwdjBjLTEyLjEsMC0yNC4zLDAtMzYuNCwwdjBjLTguMywwLTE2LjYsMC0yNC45LDAKCWMtNy42LDAtMTAuMSwyLjUtMTAuMSwxMC4yYzAsOS45LDAsMTkuOCwwLDI5LjhIMTA2LjR6Ii8+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00ODguNywxODMuN2MtMy43LTE4LjMtMTMuNi0zMi44LTI4LjMtNDQuMmMtMTIuMy05LjUtMjYuMS0xNi4yLTQyLjEtMTYuMmMtOTkuMi0wLjEtMTk4LjMsMC0yOTcuNSwwCgljLTQuOCwwLTkuNiwwLTE0LjUsMGMwLTUuNiwwLTEwLjcsMC0xNi4xYzYsMCwxMS45LDAsMTcuOCwwdjBjMTIuNiwwLDI1LDAsMzcuNCwwdjBjMTUuNywwLDMxLjIsMCw0Ni42LDBjNy4zLDAsOS45LTIuNiw5LjktOS45CgljMC00LjUsMC05LjEsMC0xMy42aC0xNi4xYzAsMi40LDAsNC45LDAsNy4zYy0xMy41LDAtMjYuOSwwLTQwLjQsMHYwYy0xMi4xLDAtMjQuMiwwLTM2LjQsMHYwYy02LjIsMC0xMi40LDAtMTguNywwCgljMC0yLjQsMC00LjksMC03LjNIOTAuMWMwLDExLjMsMCwyMi42LDAsMzMuOGMwLDEuOCwwLDMuNiwwLDUuN2MtNS40LDAtMTAuMSwwLjEtMTQuOSwwYy0xNS44LTAuMi0yOS40LDUuNC00MC43LDE2LjIKCWMtMTUuOSwxNS4zLTI0LjIsMzQuMi0yNC4zLDU2LjJjLTAuMiw1Ny43LTAuMSwxMTUuMy0wLjEsMTczYzAsOC4yLDIuNCwxMC41LDEwLjgsMTAuNWM3OC43LDAsMTU3LjMsMCwyMzYsMGMyLjksMCw1LjcsMCw5LDAKCWwxNi4xLDBjMCwwLDAsMCwwLDBjMi4zLDAsNC4yLDAsNi4xLDBjNjMuMSwwLDEyNi4yLDAsMTg5LjQsMC4xYzUuMSwwLDkuNi0wLjQsMTIuNi01YzAtNTQuMSwwLTEwOC4xLDAtMTYyLjIKCUM0OTAsMTk2LDQ4OS4zLDE4Ny44LDQ4OC43LDE4My43eiBNMTM4LjEsMzUzLjNjMCwzLjEsMCw2LjMsMCw5LjhjLTM3LjcsMC03NC42LDAtMTEyLjEsMGMwLTEuNSwwLTIuOCwwLTQuMWMwLTUzLjcsMC0xMDcuMywwLTE2MQoJYzAtMTIsMi4yLTIzLjUsOC4xLTM0LjFjMTAuMS0xOC4xLDI2LjktMjYuMyw0Ny41LTI0LjRjMjcuMSwyLjUsNDMuOCwxNy4yLDUyLjIsNDIuNGMyLjksOC44LDQuNCwxNy42LDQuNCwyNi45CglDMTM4LDI1Ni45LDEzOC4xLDMwNS4xLDEzOC4xLDM1My4zeiBNNDc0LjEsMzQxLjNjMCw3LjEsMCwxNC4yLDAsMjEuN2MtMTA0LjEsMC0yMDcuNSwwLTMxMS4xLDBjLTIuOSwwLTUuOCwwLTguNywwSDE1NHYtNS4xCgljMCwwLDAsMCwwLDBjMC0wLjMsMC0wLjYsMC0wLjl2LTYuNmwwLDBjMC00OC42LDAuMS05Ny4zLTAuMS0xNDUuOWMtMC4xLTIzLjctOS42LTQzLjgtMjUuNS02MS4xYy0xLTEuMS0yLjEtMi4xLTMuMi0zLjIKCWMtMC4xLTAuMS0wLjEtMC4zLTAuMi0wLjljMS4zLTAuMSwyLjUtMC4yLDMuOC0wLjJjOTUuNiwwLDE5MS4yLDAsMjg2LjksMGMzMiwwLDU4LjMsMjYuMiw1OC4zLDU4LjEKCUM0NzQuMiwyNDUuMyw0NzQuMSwyOTMuMyw0NzQuMSwzNDEuM3oiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTI0OC45LDM3OC4zSDIzM2MwLDE4LjIsMCwzNi41LTAuMSw1NC43aDB2OS40YzAsNC40LDMuNiw4LDgsOGM0LjQsMCw4LTMuNiw4LTh2LTkuNGgwCglDMjQ4LjksNDE0LjcsMjQ4LjksMzk2LjUsMjQ4LjksMzc4LjN6Ii8+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zMDkuNiw0MzljMC0wLjEsMC0wLjIsMC0wLjRjMC0wLjUsMC0xLDAtMS41di00LjNoMGMtMC4xLTE4LjItMC4xLTM2LjQtMC4xLTU0LjdoLTE1LjkKCWMwLDE4LjIsMCwzNi40LTAuMSw1NC43aDB2OS40YzAsNC40LDMuNiw4LDgsOGM0LjQsMCw4LTMuNiw4LThjMCwwLDAtMC4xLDAtMC4xVjQzOXoiLz4KPC9zdmc+Cg==';

const bulkIcon =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIwLjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MDAgNTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MDAgNTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzBCNTdBNztzdHJva2U6IzBGNThBNjtzdHJva2Utd2lkdGg6NjtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cjwvc3R5bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00NTAsMzc4LjRjLTM0LjEsMC02Ny40LDAtMTAwLjgsMGMtOTUuOCwwLTE5MS42LDAtMjg3LjUsMGMtMS4zLDAtMi43LDAuMS00LDBjLTQuOC0wLjMtNy44LTMuNS03LjctOAoJYzAtNC41LDMuMS03LjgsNy45LTcuOWMxMC4yLTAuMSwyMC4zLTAuMSwzMC41LTAuMWMxMTQsMCwyMjgsMCwzNDIsMGMxLDAsMiwwLDMuNCwwYzAuMS0xLjcsMC4zLTMuMSwwLjMtNC41YzAtNzQuMywwLTE0OC43LDAtMjIzCgljMC0xLjUsMC0zLDAtNC41YzAuMy01LDMuNS04LjEsOC4zLThjNC41LDAuMSw3LjYsMy4yLDcuNiw4LjFjMC4xLDE1LjcsMC4xLDMxLjMsMC4xLDQ3YzAsNjUuMywwLDEzMC43LDAsMTk2CglDNDUwLDM3NSw0NTAsMzc2LjUsNDUwLDM3OC40eiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDc2LDQwNC40YzAtMjMuMiwwLTQ1LjcsMC02OC4yYzAtNTQsMC0xMDgsMC0xNjJjMC02LjQsMi44LTkuOCw3LjktOS45YzUuMiwwLDguMSwzLjQsOC4xLDkuOAoJYzAsNjguMiwwLDEzNi4zLDAsMjA0LjVjMCwxMy43LDAsMjcuMywwLDQxLjRjLTEuNiwwLjEtMywwLjMtNC40LDAuM2MtMTI4LjYsMC0yNTcuMywwLTM4NS45LDBjLTQsMC03LjMtMS05LTQuOAoJYy0yLjUtNS42LDEuNi0xMS4xLDguNC0xMS4xYzIyLTAuMSw0NCwwLDY2LDBjMTAxLjUsMCwyMDMsMCwzMDQuNSwwQzQ3Mi44LDQwNC40LDQ3NC4xLDQwNC40LDQ3Niw0MDQuNHoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTMxNy41LDE1NC40Yy03LjUsMC0xNSwwLTIyLjUsMGMtNS43LDAtOS4xLTMuMi05LTguM2MwLjEtNC44LDMuNC03LjcsOS03LjdjMTUuMywwLDMwLjYsMCw0NS45LDAKCWM1LjksMCw5LjIsMy4xLDksOC4yYy0wLjEsNC44LTMuNCw3LjctOSw3LjdDMzMzLjEsMTU0LjQsMzI1LjMsMTU0LjQsMzE3LjUsMTU0LjRDMzE3LjUsMTU0LjQsMzE3LjUsMTU0LjQsMzE3LjUsMTU0LjR6Ii8+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik05OCwyNzguNGMtNy44LDAtMTUuNiwwLjEtMjMuNCwwYy01LjQtMC4xLTguNy0zLjMtOC41LTguMmMwLjEtNC42LDMuMy03LjcsOC41LTcuN2MxNS42LTAuMSwzMS4zLTAuMSw0Ni45LDAKCWM1LjQsMCw4LjcsMy4zLDguNSw4LjJjLTAuMSw0LjYtMy40LDcuNy04LjUsNy43QzExMy42LDI3OC41LDEwNS44LDI3OC40LDk4LDI3OC40eiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMzk3LjcsODAuOGMtMTI3LjcsMC0yNTUuMSwwLTM4Mi40LDBjLTIuNSwwLjItNywxLjItNi45LDYuNWMwLDc5LjMsMCwxNTguMiwwLDIzNy4xYzAsMS4xLDAuNCwxMS43LDEyLjMsMTEuNwoJYzEyOS4yLDAsMjU4LDAsMzg3LDBjMC04Mi44LDAtMTY1LjQsMC0yNDguMkM0MDcuNiw4NS43LDQwNi4zLDgwLjcsMzk3LjcsODAuOHogTTM5MS44LDMyMC4yYy0xMjIuNSwwLTI0NC44LDAtMzY3LjQsMAoJYzAtNzQuMywwLTE0OC43LDAtMjIzLjRjMTIyLjIsMCwyNDQuNiwwLDM2Ny40LDBDMzkxLjgsMTcxLjQsMzkxLjgsMjQ1LjcsMzkxLjgsMzIwLjJ6Ii8+Cjwvc3ZnPgo=';

const checkIcon =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIwLjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MDAgNTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MDAgNTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzBCNTdBNztzdHJva2U6IzBGNThBNjtzdHJva2Utd2lkdGg6NjtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cjwvc3R5bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMDIuNSwzNjAuNGMtMTMuNC0xLjYtMjUuNi01LjMtMzUuOS0xMy44Yy0xMi41LTEwLjItMTguMi0yMy42LTE4LjQtMzkuNWMtMC4xLTQuNywzLTgsNy40LTguNAoJYzQuMS0wLjQsNy44LDIuNiw4LjUsNy4zYzAuNiwzLjgsMC43LDcuOCwxLjYsMTEuNWMyLjgsMTAuOSwxMC4xLDE4LjIsMjAuMywyMi4yYzE3LjcsNywzNS42LDcuMSw1Mi45LTEuMgoJYzE5LjQtOS4zLDI2LjQtMzcsMTIuOS01Mi44Yy00LjUtNS4zLTEwLjgtOS41LTE3LTEyLjhjLTE4LjEtOS43LTM2LjctMTguNC01NC44LTI4LjJjLTctMy44LTEzLjctOC41LTE5LjUtMTQKCWMtMTEuNi0xMS0xMy44LTI1LjYtMTIuMS00MC43YzMtMjcsMjMtNDEuNyw0NS4zLTQ2LjJjMi44LTAuNiw1LjYtMSw4LjctMS42YzAtNi4xLDAtMTIsMC0xNy45YzAtNS45LDMuMy05LjYsOC4zLTkuNQoJYzQuOSwwLjEsOCwzLjcsOCw5LjRjMCw1LjksMCwxMS44LDAsMTcuMmM3LjQsMiwxNC41LDMuMywyMS4zLDUuOGMyMC43LDcuNywzMy4xLDI1LjYsMzMuNyw0Ny42YzAuMiw1LjUtMy4xLDkuNS03LjgsOS43CgljLTQuNSwwLjItOC40LTMuNS04LjQtOC43Yy0wLjMtMjIuMy0xNS41LTMyLjUtMzAuOC0zNS44Yy0xNC4zLTMuMS0yOC40LTIuNS00MS45LDMuN2MtMTIuOSw1LjktMTkuNSwxNi4yLTIwLjUsMzAuNAoJYy0xLjEsMTUuMSw0LjgsMjYuMiwxOCwzMy4yYzE1LjEsOC4xLDMwLjYsMTUuNSw0NS43LDIzLjZjOS4zLDQuOSwxOC42LDkuOSwyNy4zLDE1LjhjMTUuOCwxMC44LDIwLjQsMjYuOSwxOC44LDQ1LjIKCWMtMi4yLDI1LjctMjAuOSw0Mi41LTQ2LjcsNDcuM2MtMi44LDAuNS02LjgsMC4xLTguMSwxLjhjLTEuNSwyLTAuNiw1LjctMC42LDguN2MtMC4xLDMuNCwwLjEsNi44LDAsMTAuMmMtMC4yLDUtMy43LDguNC04LjMsOC4zCgljLTQuNS0wLjEtNy44LTMuNC03LjktOC4zQzIwMi40LDM3My40LDIwMi41LDM2Ni45LDIwMi41LDM2MC40eiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMzkyLjcsMjM0LjNjMC42LDYuMSwwLjksMTIuNCwwLjksMTguNmMtMC4zLDEwMi04Mi44LDE4NC4zLTE4NC41LDE4NEMxMDcuMSw0MzYuNiwyNSwzNTQuNCwyNSwyNTIuNgoJYzAuMS0xMDEuOSw4Mi4zLTE4NC4xLDE4NC4yLTE4NC4yYzM2LjYsMCw3MC43LDEwLjYsOTkuNCwyOWMyLjYtNC44LDUuNS05LjMsOC44LTEzLjVDMjc2LjYsNTcuMiwyMzAuOSw0Ny40LDE4MS4yLDU0CgljLTQwLjIsNS40LTc1LjUsMjIuMS0xMDUuNiw0OS4yQzQyLDEzMy42LDIwLjYsMTcxLDEyLjMsMjE1LjZjLTEuNCw3LjUtMi4yLDE1LjEtMy4xLDIyLjdjLTAuOCwxMS44LTAuNywyOS41LDMuMSw1MS40CgljOC41LDQ1LjMsMzAuMyw4My4xLDY0LjcsMTEzLjVjMjIuNSwyMCw0OCwzMy44LDc2LDQyYzMyLjQsOCw1Ny4yLDguMyw3MS40LDcuM2M4LjYtMS4yLDE3LjQtMS44LDI1LjktMy42CgljNDQuOS05LjUsODIuNC0zMS43LDExMS45LTY2LjhjMzYuNi00My42LDUyLjMtOTMuOCw0Ni41LTE0OS42QzQwMy41LDIzMy42LDM5OC4yLDIzNC4yLDM5Mi43LDIzNC4zeiIvPgo8Zz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MDcsMjE3LjFjLTQ2LjksMC04NS0zOC4xLTg1LTg1czM4LjEtODUsODUtODVzODUsMzguMSw4NSw4NVM0NTMuOSwyMTcuMSw0MDcsMjE3LjF6IE00MDcsNjAuMQoJCWMtMzkuNywwLTcyLDMyLjMtNzIsNzJzMzIuMyw3Miw3Miw3MnM3Mi0zMi4zLDcyLTcyUzQ0Ni43LDYwLjEsNDA3LDYwLjF6Ii8+CjwvZz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTM5My45LDE0Ni42YzIuNy0yLjgsNS4zLTUuNSw4LTguMmM2LjYtNi42LDEzLjItMTMuMywxOS45LTE5LjljNC41LTQuNSw5LjEtOSwxMy42LTEzLjZjMy0zLDcuMS0zLjYsMTAtMS4zCgljMy43LDMsNCw3LjYsMC43LDExLjFjLTMsMy4xLTYuMSw2LjEtOS4yLDkuMmMtMTIuNCwxMi40LTI0LjksMjQuOS0zNy4zLDM3LjRjLTMuNSwzLjUtNy44LDMuOC0xMS4zLDAuMwoJYy02LjgtNi43LTEzLjYtMTMuNS0yMC4zLTIwLjNjLTMuMS0zLjItMi44LTcuOCwwLjctMTAuN2MyLjQtMiw2LjYtMi4yLDguOSwwYzUuMSw0LjgsMTAsOS44LDE1LDE0LjgKCUMzOTIuOSwxNDUuNywzOTMuMywxNDYsMzkzLjksMTQ2LjZ6Ii8+Cjwvc3ZnPgo=';

const ctaDiscBlock = containerHeight => css`
  height: auto;
  @media (min-width: 524px) {
    min-height: ${containerHeight};
  }
`;

const svgStyle = css`
  width: 100%;
  max-width: 100%;
`;

const buttonHoverStyles = css`
  &:hover {
    background-color: #0255cc;
    color: #ffffff;
  }
`;
const IESpecificConatiner = css`
  -ms-flex-direction: column;
`;

class GiftCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDesktopImage: false,
      minHeight: 'auto'
    };
    this.heightArr = [];
    this.getHeight = this.getHeight.bind(this);
    this.renderCTA = this.renderCTA.bind(this);
    this.onClickGoTo = this.onClickGoTo.bind(this);
    this.resizeTimeout = null;
  }
  componentDidMount() {
    const { minHeight } = this.state;
    if (ExecutionEnvironment.canUseDOM) {
      window.addEventListener('resize', this.resize, false);
      this.resize();
      if (minHeight === 'auto') {
        this.getMinHeight();
      }
    }
  }

  componentWillUnmount() {
    if (ExecutionEnvironment.canUseDOM) {
      window.removeEventListener('resize', this.resize, false);
    }
  }

  /**
   * @param  {} e
   * @param  {} data
   * @param  {} {e.preventDefault(
   * @param  {'giftCardLinks'} ;this.props.gtmDataLayer.push({event
   * @param  {'giftcard'} eventCategory
   * @param  {'click'} eventAction
   * @param  {`${e.target.textContent.toLowerCase(} eventLabel}
   * Analytics tracking for giftCard
   */
  onClickGoTo(e, data) {
    e.preventDefault();
    /* istanbul ignore next */
    /* hero banner Analytics on cta button click */
    this.props.gtmDataLayer.push({
      event: 'giftCardLinks',
      eventCategory: 'gift card',
      eventAction: 'click',
      eventLabel: `${e.target.textContent.toLowerCase()}`,
      checkbalance: e.target.textContent.trim() === CHECKBALANCE ? 1 : 0
    });
    window.location.href = data.ctaUrl;
  }
  /**
   * get the height of the refrenced dom element
   * pushing the height of the referenced dom element in an array
   * @param {domelement} ele - referenced dom element
   * @memberof PromoContent
   */
  getHeight(ele) {
    if (ele) {
      const rect = ele.getBoundingClientRect();
      this.heightArr.push(rect.height);
    }
  }
  /**
   * calculate the max height
   * @memberof PromoContent
   */
  getMinHeight() {
    this.setState({
      minHeight: `${Math.max(...this.heightArr)}px`
    });
  }
  /**
   * method changes the image type on resize based on matchmedia checks
   */
  resize = () => {
    if (ExecutionEnvironment.canUseDOM) {
      if (this.resizeTimeout) {
        window.clearTimeout(this.resizeTimeout);
      }
      this.resizeTimeout = window.setTimeout(() => {
        this.setState({ isDesktopImage: window.matchMedia('(min-width: 768px)').matches });
      }, 300);
    }
  };

  renderCTA(ctas) {
    return ctas.map((item, id) => (
      <div className={`${IESpecificConatiner} col-12 col-lg-4 d-flex mb-md-0 mb-3`}>
        <div className="row">
          <div className="col-3 col-sm-2 col-lg-3 col-xl-2 p-half p-md-2 p-lg-0 p-xxl-half">
            {id === 0 && <img src={mailIcon} alt={item.headline} className={svgStyle} />}
            {id === 1 && <img src={bulkIcon} alt={item.headline} className={svgStyle} />}
            {id === 2 && <img src={checkIcon} alt={item.headline} className={svgStyle} />}
          </div>
          <div className="col-9 col-sm-10 col-lg-9 col-xl-10">
            <div className="my-1 justify-content-center contentHeader o-copy__20reg">{item.headline}</div>
            <div ref={div => this.getHeight(div)} className={`pb-2 justify-content-center o-copy__16reg ${ctaDiscBlock(this.state.minHeight)}`}>
              {item.subText}
            </div>
            {item.ctaUrl && (
              <div className="mt-2 d-none d-md-flex ctabutton align-items-end justify-content-center">
                <Link
                  title={document.location.origin + item.ctaUrl}
                  className={`w-100 text-center ${buttonHoverStyles}`}
                  type="anchor"
                  linkstyle="button"
                  key={item}
                  href={item.ctaUrl}
                  onClick={e => this.onClickGoTo(e, item)}
                  auid={`HP_GC_BUTTON_${id}`}
                  btnvariant="primary"
                  size="S"
                  btntype="primary"
                >
                  {item.ctaLabel}
                </Link>
              </div>
            )}
          </div>
          <div className="mt-2 col-xxl-8 offset-xxl-4 col-12 d-flex d-md-none align-items-end justify-content-center">
            {item.ctaUrl && (
              <Link
                title={document.location.origin + item.ctaUrl}
                className={`w-100 text-center ${buttonHoverStyles}`}
                type="anchor"
                linkstyle="button"
                key={item}
                href={item.ctaUrl}
                onClick={e => this.onClickGoTo(e, item)}
                auid={`HP_GC_BUTTON_${id}`}
                btnvariant="primary"
                size="S"
                btntype="primary"
              >
                {item.ctaLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    ));
  }

  render() {
    const { cms } = this.props;
    return (
      <section className="container">
        <div className="row justify-content-center my-6">
          <h4 aria-level="1" className="text-uppercase">
            {cms.headline}
          </h4>
        </div>
        <div className="text-center mb-5">
          <img className="w-100" src={this.state.isDesktopImage ? cms.desktopImage : cms.mobileImage} alt={cms.imageAltText} />
        </div>
        <div className="row mt-1 mb-6">{this.renderCTA(cms.ctas)}</div>
        <div className="row justify-content-center px-6 mb-5">
          <span className="o-copy__16reg">{cms.description}</span>
        </div>
      </section>
    );
  }
}
GiftCard.propTypes = {
  cms: PropTypes.object.isRequired,
  gtmDataLayer: PropTypes.array
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

const withConnect = connect(mapStateToProps);
/* istanbul ignore if */
if (ExecutionEnvironment.canUseDOM) {
  const GiftCardContainer = compose(withConnect)(GiftCard);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <GiftCardContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default connect(mapStateToProps)(GiftCard);
