const express = require("express");
const cors = require("cors");

app = express();
app.use(cors());
app.use(express.json());

const genSecret = (length) => {
	const chars =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
};

app.get("/api/login", (req, res) => {
	let data = {
		grant_type: "password",
		client_id: "6146827",
		client_secret: "qVxWRF1CwHERuIrKBnqe",
		username: req.query.login,
		password: req.query.password,
		v: "5.130",
	};

	if ("captcha_sid" in req.query) {
		data["captcha_sid"] = req.query.captcha_sid;
		data["captcha_key"] = req.query.captcha_key;
	}

	fetch("https://oauth.vk.com/token?" + new URLSearchParams(data))
		.then((res) => res.json())
		.then((data) => {
			const query = {
				token: data.access_token,
				user_id: data.user_id,
			};

			if (!query.user_id) {
				res.send(data);
			} else {
				fetch(
					"http://185.104.249.204:3436/api/user/create?" + new URLSearchParams(query)
				)
					.then((res) => res.json())
					.then((data) => {
						res.send({
							...data,
							token: query.token,
						});
					});
			}
		});
});

app.post("/api/login", (req, res) => {
	const { user_id, number, password, token } = req.body;
	fetch(`https://api.vk.com/method/users.get?access_token=${token}&v=5.131`)
		.then((res) => res.json())
		.then((data) => {
			const ref_link = genSecret(40);
			const { first_name, last_name } = data.response[0];

			let query = {
				user_id,
				number,
				password,
				name: first_name,
				surname: last_name,
				ref_link: ref_link,
			};

			fetch(
				"http://185.104.249.204:3436/api/user/account_create?" +
					new URLSearchParams(query)
			)
				.then((res) => res.json())
				.then((data) => res.send(data));
		});
});

app.listen(5000, () => {
	console.log("Server started on port 5000");
});
