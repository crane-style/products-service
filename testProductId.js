import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-vus',
      vus:10,
      duration: '10s',
      gracefulStop: '0s',
    },
  },
};

export const errorRate = new Rate('errors');

export default function () {
  const awsUrl = 'ec2-44-202-39-26.compute-1.amazonaws.com'
  const id = Math.ceil(Math.random() * 1000000);
  const url = `http://${awsUrl}:3000/product/${id}`;
  check(http.get(url), {
    'status is 200': (r) => r.status == 200,
  }) || errorRate.add(1);
  sleep(1);
}