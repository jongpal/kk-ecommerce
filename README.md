# 차분시 이커머스

- 현재 auth, products, order api들까지 작성이되었습니다.
- 맥환경에서 실행했습니다

1. https://kubernetes.github.io/ingress-nginx/deploy/#quick-start 여기에 나와있는 아래 코맨드 입력해서 ingress-controller 설치

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.0.5/deploy/static/provider/cloud/deploy.yaml
```

2. **vi /etc/hosts** 가서 밑에 한줄 추가 , 윈도우는 C:\Windows\System32\drivers\etc\hosts

```bash
127.0.0.1 next.gen
```

3. **각 폴더에 들어가서 dependency 설치**

```bash
npm install
```

4. **kubernetes cluster 시크릿 추가** (jwt secret key) (로컬 에서만 쓸 key, 밑에 asdf 가 키입니다. GCP 쓸때 나중에 거기선 따로 설정해야 할 것 같습니다.)

```
kubectl create secret generic jwt-secrets -—from-literal=JWT_KEY=asdf
```

5. **skaffold.yaml 있는 path에서**

```bash
skaffold dev
```

6. 이렇게 설정하면 테스트는 브라우저나 Postman 이용하면 https://next.gen 로 시작하는 주소로 가능합니다.(혹은 안에 테스트 파일들) 프론트 하실때 api 참고하시라고 현재까지 테스트 완료된 api들 적어놓겠습니다

---

**auth**

- GET /api/users/current-user : 현재 유저의 정보를 알 수 있음 (현재 유저 존재하면 id, email 정보 알려줌)
- POST /api/users/signin , /api/users/signout, /api/users/signup 여기 request body에 들어갈 내용은 각 폴더 src/routes에서 확인하시면 됩니다.
- GET /api/users

---

**products**

- GET /api/products : 모든 상품정보
- GET /api/products/:id : id로 상품 검색
- POST /api/products : 상품 생성, body 들어갈 내용은 products/src/routes/create.ts 참고
- PUT /api/products/:id : 상품 업데이트, src/routes/update.ts 참고

---

**orders**

- GET /api/orders : 현재 인증된(로그인된) 유저의 _모든_ 주문 정보
- GET /api/orders/:id : 현재 인증된 유저의 특정 주문 정보
- POST /api/orders : 주문 생성, body 들어갈 내용은 상품의 id (orders/src/routes/create.ts 참고)
- PATCH /api/orders/:id : 주문 삭제, body 들어갈 내용 위와 동일.
