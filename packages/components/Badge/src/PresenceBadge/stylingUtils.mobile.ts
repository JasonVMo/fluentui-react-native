import type { PresenceBadgeIconPath, PresenceBadgeStatus } from './PresenceBadge.types';
import type { BadgeSize } from '../Badge.types';

function getPresenceIconPathBySize(size: BadgeSize): PresenceBadgeIconPath {
  switch (size) {
    case 'large':
      return {
        available:
          'M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM11.7069 6.70739L7.70361 10.7074C7.51595 10.8949 7.26147 11.0002 6.99619 11C6.7309 10.9998 6.47655 10.8943 6.28912 10.7065L4.29233 8.70654C3.90212 8.3157 3.90262 7.68254 4.29346 7.29233C4.6843 6.90212 5.31746 6.90262 5.70767 7.29346L6.99765 8.58551L10.2932 5.29261C10.6839 4.90224 11.3171 4.9025 11.7074 5.29318C12.0978 5.68386 12.0975 6.31703 11.7069 6.70739Z',
        away: 'M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM8.5 4.5V7.51937L10.6247 9.21913C11.056 9.56414 11.1259 10.1934 10.7809 10.6247C10.4359 11.056 9.80657 11.1259 9.37531 10.7809L6.87531 8.78087C6.63809 8.5911 6.5 8.30378 6.5 8V4.5C6.5 3.94772 6.94772 3.5 7.5 3.5C8.05229 3.5 8.5 3.94772 8.5 4.5Z',
        blocked:
          'M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM14 8C14 6.70415 13.5892 5.50424 12.8907 4.52341L4.52341 12.8907C5.50424 13.5892 6.70415 14 8 14C11.3137 14 14 11.3137 14 8ZM11.4765 3.10921C10.4957 2.41078 9.29581 2 8 2C4.68629 2 2 4.68629 2 8C2 9.29581 2.41078 10.4957 3.10921 11.4765L11.4765 3.10921Z',
        busy: 'M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8Z',
        doNotDisturb:
          'M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.24902 7H10.7499C11.3022 7 11.7499 7.44772 11.7499 8C11.7499 8.55229 11.3022 9 10.7499 9H5.24902C4.69674 9 4.24902 8.55229 4.24902 8C4.24902 7.44772 4.69674 7 5.24902 7Z',
        offline:
          'M10.7071 5.29289C11.0976 5.68342 11.0976 6.31658 10.7071 6.70711L9.41421 8L10.7071 9.29289C11.0976 9.68342 11.0976 10.3166 10.7071 10.7071C10.3166 11.0976 9.68342 11.0976 9.29289 10.7071L8 9.41421L6.70711 10.7071C6.31658 11.0976 5.68342 11.0976 5.29289 10.7071C4.90237 10.3166 4.90237 9.68342 5.29289 9.29289L6.58579 8L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L8 6.58579L9.29289 5.29289C9.68342 4.90237 10.3166 4.90237 10.7071 5.29289ZM0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8ZM8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2Z',
        unknown:
          'M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2ZM0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z',
        availableOutOfOffice:
          'M11.7071 6.70711C12.0976 6.31658 12.0976 5.68342 11.7071 5.29289C11.3166 4.90237 10.6834 4.90237 10.2929 5.29289L7 8.58579L5.70711 7.29289C5.31658 6.90237 4.68342 6.90237 4.29289 7.29289C3.90237 7.68342 3.90237 8.31658 4.29289 8.70711L6.29289 10.7071C6.68342 11.0976 7.31658 11.0976 7.70711 10.7071L11.7071 6.70711ZM0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8ZM8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2Z',
        outOfOffice:
          'M8.2071 6.20736C8.59763 5.81684 8.59764 5.18368 8.20712 4.79315C7.8166 4.40262 7.18344 4.40261 6.7929 4.79313L4.2929 7.29304C4.10536 7.48058 4 7.73493 4 8.00015C4 8.26537 4.10535 8.51973 4.29289 8.70727L6.79289 11.2073C7.18342 11.5978 7.81658 11.5978 8.20711 11.2073C8.59763 10.8167 8.59763 10.1836 8.20711 9.79305L7.41421 9.00016H11C11.5523 9.00016 12 8.55244 12 8.00016C12 7.44788 11.5523 7.00016 11 7.00016H7.41427L8.2071 6.20736ZM8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0ZM2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8Z',
        doNotDisturbOutOfOffice:
          'M5.25 7C4.69772 7 4.25 7.44772 4.25 8C4.25 8.55228 4.69772 9 5.25 9H10.75C11.3023 9 11.75 8.55228 11.75 8C11.75 7.44772 11.3023 7 10.75 7H5.25ZM0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8ZM8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2Z',
      };
    case 'medium':
    default:
      return {
        available:
          'M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM8.53033 5.28033L5.78033 8.03033C5.48744 8.32322 5.01256 8.32322 4.71967 8.03033L3.71967 7.03033C3.42678 6.73744 3.42678 6.26256 3.71967 5.96967C4.01256 5.67678 4.48744 5.67678 4.78033 5.96967L5.25 6.43934L7.46967 4.21967C7.76256 3.92678 8.23744 3.92678 8.53033 4.21967C8.82322 4.51256 8.82322 4.98744 8.53033 5.28033Z',
        away: 'M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM6.5 3.25V5.65505L7.98809 6.93056C8.30259 7.20012 8.33901 7.6736 8.06944 7.98809C7.79988 8.30259 7.3264 8.33901 7.01191 8.06944L5.26191 6.56944C5.09567 6.42696 5 6.21894 5 6V3.25C5 2.83579 5.33579 2.5 5.75 2.5C6.16421 2.5 6.5 2.83579 6.5 3.25Z',
        blocked:
          'M12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6ZM10.5 6C10.5 5.02811 10.1919 4.12819 9.66804 3.39257L3.39257 9.66804C4.12819 10.1919 5.02811 10.5 6 10.5C8.48528 10.5 10.5 8.48528 10.5 6ZM8.60737 2.33192C7.87176 1.80808 6.97186 1.5 6 1.5C3.51472 1.5 1.5 3.51472 1.5 6C1.5 6.97186 1.80808 7.87176 2.33192 8.60737L8.60737 2.33192Z',
        busy: 'M12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6Z',
        doNotDisturb:
          'M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM3.75 5.25H8.25C8.66421 5.25 9 5.58579 9 6C9 6.41421 8.66421 6.75 8.25 6.75H3.75C3.33579 6.75 3 6.41421 3 6C3 5.58579 3.33579 5.25 3.75 5.25Z',
        offline:
          'M8.03033 3.96967C8.32322 4.26256 8.32322 4.73744 8.03033 5.03033L7.06065 6.00002L8.03033 6.9697C8.32322 7.26259 8.32322 7.73747 8.03033 8.03036C7.73744 8.32325 7.26256 8.32325 6.96967 8.03036L5.99998 7.06068L5.03033 8.03033C4.73744 8.32322 4.26256 8.32322 3.96967 8.03033C3.67678 7.73744 3.67678 7.26256 3.96967 6.96967L4.93932 6.00002L3.96967 5.03036C3.67678 4.73747 3.67678 4.26259 3.96967 3.9697C4.26256 3.67681 4.73744 3.67681 5.03033 3.9697L5.99998 4.93935L6.96967 3.96967C7.26256 3.67678 7.73744 3.67678 8.03033 3.96967ZM0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6ZM6 1.5C3.51472 1.5 1.5 3.51472 1.5 6C1.5 8.48528 3.51472 10.5 6 10.5C8.48528 10.5 10.5 8.48528 10.5 6C10.5 3.51472 8.48528 1.5 6 1.5Z',
        unknown:
          'M6 1.5C3.51472 1.5 1.5 3.51472 1.5 6C1.5 8.48528 3.51472 10.5 6 10.5C8.48528 10.5 10.5 8.48528 10.5 6C10.5 3.51472 8.48528 1.5 6 1.5ZM0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6Z',
        availableOutOfOffice:
          'M6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0ZM1.5 6C1.5 3.51472 3.51472 1.5 6 1.5C8.48528 1.5 10.5 3.51472 10.5 6C10.5 8.48528 8.48528 10.5 6 10.5C3.51472 10.5 1.5 8.48528 1.5 6ZM8.53033 4.21967C8.82322 4.51256 8.82322 4.98744 8.53033 5.28033L5.78033 8.03033C5.48744 8.32322 5.01256 8.32322 4.71967 8.03033L3.71967 7.03033C3.42678 6.73744 3.42678 6.26256 3.71967 5.96967C4.01256 5.67678 4.48744 5.67678 4.78033 5.96967L5.25 6.43934L7.46967 4.21967C7.76256 3.92678 8.23744 3.92678 8.53033 4.21967Z',
        outOfOffice:
          'M6.28118 4.52837C6.57407 4.23547 6.57407 3.7606 6.28117 3.46771C5.98828 3.17481 5.5134 3.17482 5.22051 3.46771L3.21845 5.46979C2.92556 5.76269 2.92556 6.23756 3.21845 6.53045L5.22052 8.53251C5.51341 8.8254 5.98828 8.8254 6.28118 8.53251C6.57407 8.23962 6.57407 7.76474 6.28117 7.47185L5.55944 6.75012H8.24991C8.66412 6.75012 8.99991 6.41434 8.99991 6.00012C8.99991 5.58591 8.66412 5.25012 8.24991 5.25012H5.55943L6.28118 4.52837ZM6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0ZM1.5 6C1.5 3.51472 3.51472 1.5 6 1.5C8.48528 1.5 10.5 3.51472 10.5 6C10.5 8.48528 8.48528 10.5 6 10.5C3.51472 10.5 1.5 8.48528 1.5 6Z',
        doNotDisturbOutOfOffice:
          'M6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0ZM1.5 6C1.5 3.51472 3.51472 1.5 6 1.5C8.48528 1.5 10.5 3.51472 10.5 6C10.5 8.48528 8.48528 10.5 6 10.5C3.51472 10.5 1.5 8.48528 1.5 6ZM3 6C3 5.58579 3.33579 5.25 3.75 5.25H8.25C8.66421 5.25 9 5.58579 9 6C9 6.41421 8.66421 6.75 8.25 6.75H3.75C3.33579 6.75 3 6.41421 3 6Z',
      };
    case 'small':
      return {
        available:
          'M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10ZM7.10356 4.10355L4.85357 6.35356C4.65831 6.54883 4.34173 6.54883 4.14646 6.35357L3.14645 5.35357C2.95119 5.1583 2.95118 4.84172 3.14644 4.64646C3.34171 4.45119 3.65829 4.45119 3.85355 4.64645L4.50001 5.29291L6.39644 3.39645C6.59171 3.20119 6.90829 3.20118 7.10355 3.39644C7.29881 3.59171 7.29882 3.90829 7.10356 4.10355Z',
        away: 'M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10ZM5 3.00414V4.7931L6.35355 6.14666C6.54882 6.34192 6.54882 6.6585 6.35355 6.85376C6.15829 7.04902 5.84171 7.04902 5.64645 6.85376L4.14645 5.35376C4.05268 5.25999 4 5.13282 4 5.00021V3.00414C4 2.728 4.22386 2.50414 4.5 2.50414C4.77614 2.50414 5 2.728 5 3.00414Z',
        blocked:
          'M10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10C7.76142 10 10 7.76142 10 5ZM9 5C9 7.20914 7.20914 9 5 9C4.07563 9 3.2245 8.68645 2.54715 8.15991L8.15991 2.54715C8.68645 3.2245 9 4.07563 9 5ZM7.4528 1.84005L1.84005 7.4528C1.31353 6.77546 1 5.92434 1 5C1 2.79086 2.79086 1 5 1C5.92434 1 6.77546 1.31353 7.4528 1.84005Z',
        busy: 'M10 5C10 7.76142 7.76142 10 5 10C2.23858 10 0 7.76142 0 5C0 2.23858 2.23858 0 5 0C7.76142 0 10 2.23858 10 5Z',
        doNotDisturb:
          'M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10ZM3.5 4.5H6.5C6.77614 4.5 7 4.72386 7 5C7 5.27614 6.77614 5.5 6.5 5.5H3.5C3.22386 5.5 3 5.27614 3 5C3 4.72386 3.22386 4.5 3.5 4.5Z',
        offline:
          'M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L5.70711 5L6.85355 6.14645C7.04882 6.34171 7.04882 6.65829 6.85355 6.85355C6.65829 7.04882 6.34171 7.04882 6.14645 6.85355L5 5.70711L3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355C2.95118 6.65829 2.95118 6.34171 3.14645 6.14645L4.29289 5L3.14645 3.85355C2.95118 3.65829 2.95118 3.34171 3.14645 3.14645C3.34171 2.95118 3.65829 2.95118 3.85355 3.14645L5 4.29289L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645ZM0 5.00003C0 2.23859 2.23859 0 5.00003 0C7.76147 0 10.0001 2.23859 10.0001 5.00003C10.0001 7.76147 7.76147 10.0001 5.00003 10.0001C2.23859 10.0001 0 7.76147 0 5.00003ZM5.00003 1C2.79088 1 1 2.79088 1 5.00003C1 7.20919 2.79088 9.00007 5.00003 9.00007C7.20919 9.00007 9.00007 7.20919 9.00007 5.00003C9.00007 2.79088 7.20919 1 5.00003 1Z',
        unknown:
          'M4.99869 1C2.79027 1 1 2.79027 1 4.99869C1 7.2071 2.79027 8.99738 4.99869 8.99738C7.2071 8.99738 8.99738 7.2071 8.99738 4.99869C8.99738 2.79027 7.2071 1 4.99869 1ZM0 4.99869C0 2.23799 2.23799 0 4.99869 0C7.75939 0 9.99738 2.23799 9.99738 4.99869C9.99738 7.75939 7.75939 9.99738 4.99869 9.99738C2.23799 9.99738 0 7.75939 0 4.99869Z',
        availableOutOfOffice:
          'M4.99769 0C2.23754 0 0 2.23754 0 4.99769C0 7.75784 2.23754 9.99538 4.99769 9.99538C7.75784 9.99538 9.99538 7.75784 9.99538 4.99769C9.99538 2.23754 7.75784 0 4.99769 0ZM1 4.99769C1 2.78983 2.78983 1 4.99769 1C7.20555 1 8.99538 2.78983 8.99538 4.99769C8.99538 7.20555 7.20555 8.99538 4.99769 8.99538C2.78983 8.99538 1 7.20555 1 4.99769ZM7.10355 3.39645C7.29882 3.59171 7.29882 3.90829 7.10355 4.10355L4.85355 6.35355C4.65829 6.54882 4.34171 6.54882 4.14645 6.35355L3.14645 5.35355C2.95118 5.15829 2.95118 4.84171 3.14645 4.64645C3.34171 4.45118 3.65829 4.45118 3.85355 4.64645L4.5 5.29289L6.39645 3.39645C6.59171 3.20118 6.90829 3.20118 7.10355 3.39645Z',
        outOfOffice:
          'M5.34876 3.85081C5.54386 3.65539 5.54359 3.3388 5.34816 3.14371C5.15273 2.94861 4.83615 2.94888 4.64105 3.1443L3.14358 4.64431C2.94872 4.8395 2.94872 5.15563 3.14359 5.35082L4.64106 6.85081C4.83615 7.04624 5.15274 7.04651 5.34816 6.85141C5.54359 6.65631 5.54386 6.33973 5.34876 6.1443L4.70311 5.49756H6.50271C6.77885 5.49756 7.00271 5.27371 7.00271 4.99756C7.00271 4.72142 6.77885 4.49756 6.50271 4.49756H4.7031L5.34876 3.85081ZM4.99769 0C2.23754 0 0 2.23754 0 4.99769C0 7.75784 2.23754 9.99538 4.99769 9.99538C7.75784 9.99538 9.99538 7.75784 9.99538 4.99769C9.99538 2.23754 7.75784 0 4.99769 0ZM1 4.99769C1 2.78983 2.78983 1 4.99769 1C7.20555 1 8.99538 2.78983 8.99538 4.99769C8.99538 7.20555 7.20555 8.99538 4.99769 8.99538C2.78983 8.99538 1 7.20555 1 4.99769Z',
        doNotDisturbOutOfOffice:
          'M4.99769 0C2.23754 0 0 2.23754 0 4.99769C0 7.75784 2.23754 9.99538 4.99769 9.99538C7.75784 9.99538 9.99538 7.75784 9.99538 4.99769C9.99538 2.23754 7.75784 0 4.99769 0ZM1 4.99769C1 2.78983 2.78983 1 4.99769 1C7.20555 1 8.99538 2.78983 8.99538 4.99769C8.99538 7.20555 7.20555 8.99538 4.99769 8.99538C2.78983 8.99538 1 7.20555 1 4.99769ZM3 5C3 4.72386 3.22386 4.5 3.5 4.5H6.5C6.77614 4.5 7 4.72386 7 5C7 5.27614 6.77614 5.5 6.5 5.5H3.5C3.22386 5.5 3 5.27614 3 5Z',
      };
  }
}

export function getIconPath(status: PresenceBadgeStatus, isOutOfOffice: boolean, size: BadgeSize): string {
  const presenceIconPaths: PresenceBadgeIconPath = getPresenceIconPathBySize(size);
  switch (status) {
    case 'available':
    default:
      return isOutOfOffice ? presenceIconPaths.availableOutOfOffice : presenceIconPaths.available;
    case 'away':
      return isOutOfOffice ? presenceIconPaths.outOfOffice : presenceIconPaths.away;
    case 'busy':
      return isOutOfOffice ? presenceIconPaths.unknown : presenceIconPaths.busy;
    case 'doNotDisturb':
      return isOutOfOffice ? presenceIconPaths.doNotDisturbOutOfOffice : presenceIconPaths.doNotDisturb;
    case 'offline':
      return presenceIconPaths.offline;
    case 'outOfOffice':
      return presenceIconPaths.outOfOffice;
    case 'unknown':
      return presenceIconPaths.unknown;
    case 'blocked':
      return presenceIconPaths.blocked;
  }
}