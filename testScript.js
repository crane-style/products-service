/* eslint-disable no-unused-expressions */
/* eslint-disable eqeqeq */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-vus',
      vus: 100,
      duration: '60s',
      gracefulStop: '0s',
    },
  },
};

export const errorRate = new Rate('errors');

export default function () {
  const productId = Math.ceil(Math.random() * 10000);
  const url = `http://localhost:3000/product/${productId}/styles`;
  check(http.get(url), {
    'status is 200': (r) => r.status == 200,
  }) || errorRate.add(1);
  sleep(1);
}
