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
