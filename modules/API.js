import { Alert} from 'react-native';

export default class API {
	constructor(apiUrl, apiToken, ticker = "AAPL", figi = "BBG000B9XRY4", price = "", bid=[], ask=[]) {
		this._apiUrl = apiUrl;
		this._apiToken = apiToken;
		this.ticker = ticker;
		this.figi = figi;
		this.price = price;
		this.orderAsk = ask;
		this.orderBid = bid;
	}
	head() {
		return {
			Authorization: 'Bearer ' + this._apiToken,
			'Content-Type': 'application/json'
		}
	}
	changeTicker(ticker) {
		this.ticker = ticker;
	}
	async getFigi() {
		try{
		const answer = await fetch(this._apiUrl + "/market/search/by-ticker?ticker=" + this.ticker, { headers: this.head() });
		const figi = await answer.json();
		this.figi = figi.payload.instruments[0].figi;
		this.price = 0;
		return figi.payload.instruments[0];
		} catch {
			this.ticker= "AAPL";
			Alert.alert("Такого тикера не существует");
			return {name: "AAPL"}
		}
	}
	async getOrders() {
		const answer = await fetch(this._apiUrl + "/orders", { headers: this.head() });
		const orders = await answer.json();
		return orders.payload;
	}
	async sell(vol) {
		const orders = await this.getOrders();
		const sell = orders.filter((order) => order.operation === 'Sell' && order.figi === this.figi);
		sell.map(async (sel) => {
			await this.cancelOrder(sel.orderId); 
			const price = Number((sel.price + vol).toFixed(2));
			let lots = sel.requestedLots - sel.executedLots;
			const operation = sel.operation;
			await this.sendLimitOrder(lots, operation, price);
		});
	}
	async buy(vol) {
		const orders = await this.getOrders();
		const buy = orders.filter((order) => order.operation === 'Buy' && order.figi === this.figi);
		buy.map(async (bu) => {
			await this.cancelOrder(bu.orderId); 
			const price = Number((bu.price + vol).toFixed(2));
			let lots = bu.requestedLots - bu.executedLots;
			const operation = bu.operation;
			await this.sendLimitOrder(lots, operation, price);
		});
	}
	async cancelOrder(orderid) {
		const answer = await fetch(this._apiUrl + `/orders/cancel?orderId=${orderid}`, {
			method: 'POST',
			headers: this.head()
		});
		const order = await answer.json();
		return order.status;
	}
	async sendLimitOrder(lots, operation, price) {
		const limOrd = {
			"lots": lots,
			"operation": operation,
			"price": price
		}
		const answer = await fetch(this._apiUrl + `/orders/limit-order?figi=${this.figi}`, {
			method: 'POST',
			headers: this.head(),
			body: JSON.stringify(limOrd)
		});
		const order = await answer.json();
		return order.payload;
	}
	async sendMarketOrder(lots, operation) {
		const marketOrd = {
			"lots": lots,
			"operation": operation,
		}
		const answer = await fetch(this._apiUrl + `/orders/market-order?figi=${this.figi}`, {
			method: 'POST',
			headers: this.head(),
			body: JSON.stringify(marketOrd)
		});
		const order = await answer.json();
		return order.payload;
	}
	async portfolio() {
		const answer = await fetch(this._apiUrl + "/portfolio", { headers: this.head() });
		const portfolio = await answer.json();
		return portfolio.payload.positions;
	}
	async getBalance() {
		try{
			const answer = await fetch(this._apiUrl + "/market/orderbook?figi=BBG0013HGFT4&depth=1", { headers: this.head() });
			const USDD = await answer.json();
			const answers = await fetch(this._apiUrl + "/portfolio", { headers: this.head() });
			const portfolio = await answers.json();
			let RUBB = await fetch(this._apiUrl + "/portfolio/currencies", { headers: this.head() });
			RUBB = await RUBB.json();
			RUBB = RUBB.payload.currencies[1].balance
			const positions = portfolio.payload.positions;
			let USD = positions.filter((position) => position.averagePositionPrice.currency === "USD");
			USD = USD.reduce((sum, position) => sum += (position.balance * position.averagePositionPrice.value) + position.expectedYield.value, 0)
			let RUB = positions.filter((position) => position.averagePositionPrice.currency === "RUB");
			RUB = RUB.reduce((sum, position) => sum += (position.balance * position.averagePositionPrice.value) + position.expectedYield.value, 0)
			return {balance:((USD * USDD.payload.lastPrice) + RUB + RUBB).toFixed(2)};
		} catch (error) {
			return {balance: 0};}
	}
	async getOrderbook() {
		const answer = await fetch(this._apiUrl + `/market/orderbook?figi=${this.figi}&depth=14`, { headers: this.head() });
		const orderbook = await answer.json();
		return orderbook.payload;
	}
}
