// api/hello.js
module.exports = (req, res) => {
  console.log('hello invoked');
  res.status(200).json({ ok: true });
};