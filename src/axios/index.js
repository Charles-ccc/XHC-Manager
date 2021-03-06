import JsonP from 'jsonp'
import axios from 'axios'
import { Modal } from 'antd'
import Utils from '../utils/util'
export default class Axiox {
	static requestList(_this, url, params, isMock) {
		let data = {
			parmas: params,
			isMock
		}
		this.ajax({
			url,
			data
		}).then((data) => {
			if (data && data.result) {
				let list = data.result.item_list.map((item, index) => {
					item.key = index
					return item
				})
				_this.setState({
					list,
					pagination: Utils.pagination(data, (current) => {
						_this.params.page = current
						_this.requestList()
					})
				})
			}
		})
	}

	static jsonp(options) {
		return new Promise((resolve, reject) => {
			JsonP(options.url, {
				param: 'callback'
			}, function (err, response) {
				if (response.status === 'success') {
					resolve(response);
				} else {
					reject(response.messsage);
				}
			})
		})
	}
	static ajax(options) {
		let loading;
		if (options.data && options.data.isShowLoading !== false) {
			loading = document.getElementById('ajaxLoading');
			loading.style.display = 'block';
		}
		// const baseApi = 'https://www.easy-mock.com/mock/5c7fd1d58cfae820245a9a92/xhcmanager';
		const baseApi = 'https://www.easy-mock.com/mock/5a7278e28d0c633b9c4adbd7/api';

		return new Promise((resolve, reject) => {
			axios({
				url: options.url,
				method: 'get',
				baseURL: baseApi,
				timeout: 600000,
				params: (options.data && options.data.params) || ''
			}).then((response) => {
				if (options.data && options.data.isShowLoading !== false) {
					loading = document.getElementById('ajaxLoading');
					loading.style.display = 'none';
				}
				if (response.status === 200) {
					const res = response.data;
					if (res.code == '0') {
						resolve(res);
					} else {
						Modal.info({
							title: "提示",
							content: "数据返回有误"
						})
					}
				} else {
					reject(response.data);
				}
			})
		});
	}
}