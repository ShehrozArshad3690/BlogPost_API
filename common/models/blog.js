"use strict";

const author = require("./author");

module.exports = function (Blog) {
  let contentFormat = /<([^>]+)>(.*?)<\/\1>/;
  Blog.validatesFormatOf("content", {
    with: contentFormat,
    message: "Must provide a valid content body",
  });

  Blog.observe("before save", (ctx, next) => {
    let { authorId } = ctx.instance;
    if (
      ctx &&
      ctx.options &&
      ctx.options.accessToken &&
      ctx.options.accessToken.userId &&
      ctx.options.accessToken.userId.toString() == authorId.toString()
    ) {
      next();
    } else {
      throw new Error("Unauthorized");
    }
  });

  Blog.observe("after save", async (ctx, next) => {
    try {
      let { authorId, title } = ctx.instance;
      let blogAuthorData = await Blog.findOne({
        where: { authorId },
        include: "author",
      });
      console.log(title + " " + blogAuthorData.author().authorName);
    } catch (error) {
      return next(error);
    }
  });

  Blog.observe("access", async (ctx, next) => {
    // get author id from access token of logged-in user
    let authorId =
      ctx &&
      ctx.options &&
      ctx.options.accessToken &&
      ctx.options.accessToken.userId &&
      ctx.options.accessToken.userId.toString();
    // get authorData from database on the basis of authorId
    let authorData = await Blog.app.models.Author.findById(authorId);
    // authorize only teacher to continue...
    if (authorData.role == "Teacher" || authorData.role == "teacher") {
      next();
    } else {
      throw new Error(`You don't have permission to see blogs`);
    }
  });
};
