"use strict";


module.exports = function (Author) {
  Author.observe("before save", (ctx, next) => {
    if (
      ctx.instance.role == "teacher" ||
      ctx.instance.role == "Teacher" ||
      ctx.instance.role == "Student" ||
      ctx.instance.role == "student" ||
      ctx.instance.role == "Staff" ||
      ctx.instance.role == "staff"
    ) {
      next();
    } else {
      throw new Error("Invalid Role Type");
    }
  });

};
