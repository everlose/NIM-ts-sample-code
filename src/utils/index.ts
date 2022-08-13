// export function promisify(fn: any) {
//   return function (firstArg?: any, ...args: any) {
//     return new Promise((resolve, reject) => {
//       if (firstArg && typeof firstArg === "object") {
//         firstArg.done = function (err: any, data: any) {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(data);
//           }
//         };
//       }
//       fn.call(window.nim, firstArg, ...args);
//     });
//   };
// }

import {
  NIM_Message,
  NIM_MsgScene,
} from '@/3rd/NIM_Web_SDK_v8.9.100/MessageInterface'

export function stringifyDate(time: number, simple = false) {
  // let weekMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const weekMap = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ]
  const datetime = new Date(time)
  const year = datetime.getFullYear()
  const simpleYear = datetime.getFullYear() - 100
  const monthOrigin = datetime.getMonth() + 1
  const month = monthOrigin > 9 ? monthOrigin : '0' + monthOrigin
  const dayOrigin = datetime.getDate()
  const day = dayOrigin > 9 ? dayOrigin : '0' + dayOrigin
  const hourOrigin = datetime.getHours()
  const hour = hourOrigin > 9 ? hourOrigin : '0' + hourOrigin
  const minOrigin = datetime.getMinutes()
  const min = minOrigin > 9 ? minOrigin : '0' + minOrigin
  const week = weekMap[datetime.getDay()]
  const thatDay = new Date(year, monthOrigin - 1, dayOrigin, 0, 0, 0).getTime()

  if (simple) {
    return {
      withYear: `${day}/${month}/${simpleYear}`,
      withMonth: `${month}-${day}`,
      withDay: `${week}`,
      withLastDay: `昨天`,
      withHour: `${hour}:${min}`,
      thatDay,
    }
  } else {
    return {
      withYear: `${year}-${month}-${day} ${hour}:${min}`,
      withMonth: `${month}-${day} ${hour}:${min}`,
      withDay: `${week} ${hour}:${min}`,
      withLastDay: `昨天 ${hour}:${min}`,
      withHour: `${hour}:${min}`,
      thatDay,
    }
  }
}

/* 格式化日期 */
export function formatDate(datetime: number, simple = false) {
  const tempDate = new Date().getTime()
  const result = stringifyDate(datetime, simple)
  const thatDay = result.thatDay
  const deltaTime = (tempDate - thatDay) / 1000

  if (deltaTime < 3600 * 24) {
    return result.withHour
  } else if (deltaTime < 3600 * 24 * 2) {
    return result.withLastDay
  } else if (deltaTime < 3600 * 24 * 7) {
    return result.withDay
  } else if (deltaTime < 3600 * 24 * 30) {
    return result.withMonth
  } else {
    return result.withYear
  }
}

export function getMessageDescribe(message: NIM_Message) {
  switch (message.type) {
    case 'text':
      return message.text
    case 'video':
      return '[视频消息]'
    case 'audio':
      return '[音频消息]'
    case 'image':
      return '[图片消息]'
    case 'notification':
      return '[通知消息]'
    default:
      return '[其他类型消息]'
  }
}

/**
 * 从 sessionId 中获取 accid 和 scene
 *
 * 修正处理 sessionId，得到 scene 和 accid 的逻辑，
 * 不能再用 split 因为用户的 accid 可能带着 - 符号
 * 订正后的逻辑：找到第一个 "-" 符号，然后这个符号的前半部分是 scene，后面的全都是 accid
 */
export function getAccountFromSessionId(
  sessionId: string,
  separator = '-'
): {
  accid: string
  scene: NIM_MsgScene
} {
  if (!sessionId) {
    throw new Error('No sessionId')
  }
  const idx = sessionId.indexOf(separator)
  if (idx === -1) {
    throw new Error('Can not find conjunctions')
  }
  const scene = sessionId.slice(0, idx)
  const toAccid = sessionId.slice(idx + 1)
  return {
    accid: toAccid,
    scene: (scene === 'super_team' ? 'superTeam' : scene) as NIM_MsgScene,
  }
}
