# Hướng dẫn tạo bài viết blog mới cho Hyperliquid Vietnam

Tài liệu này hướng dẫn cách tạo một bài viết blog mới cho website Hyperliquid Vietnam, bao gồm cách thêm hình ảnh và định dạng nội dung.

## Cấu trúc thư mục

Các bài viết blog được lưu trữ trong thư mục `hype4/blog/markdown/`. Mỗi bài viết là một file markdown (`.md`) riêng biệt.

Hình ảnh cho blog được lưu trữ trong thư mục `hype4/blog/images/`.

## Tạo bài viết mới

### Bước 1: Tạo file markdown mới

Tạo một file markdown mới trong thư mục `hype4/blog/markdown/` với tên file là slug của bài viết (không dấu, thay khoảng trắng bằng dấu gạch ngang).

Ví dụ: `hype4/blog/markdown/huong-dan-trading.md`

### Bước 2: Thêm frontmatter

Mỗi bài viết cần có phần frontmatter ở đầu file, được đánh dấu bằng ba dấu gạch ngang (`---`). Frontmatter chứa thông tin meta của bài viết.

```markdown
---
title: Tiêu đề bài viết
date: YYYY-MM-DD
author: Tên tác giả
category: tutorial
readTime: 10
excerpt: Mô tả ngắn về bài viết, sẽ hiển thị ở trang danh sách bài viết.
image: <img src="/blog/images/ten-file-anh.webp" alt="Mô tả hình ảnh" style="width:100%;height:auto;">
featured: false
---
```

Trong đó:
- `title`: Tiêu đề bài viết
- `date`: Ngày đăng bài viết (định dạng YYYY-MM-DD)
- `author`: Tên tác giả
- `category`: Danh mục bài viết (tutorial, news, analysis, airdrop)
- `readTime`: Thời gian đọc ước tính (phút)
- `excerpt`: Mô tả ngắn về bài viết
- `image`: Thẻ HTML img chứa đường dẫn đến hình ảnh đại diện
- `featured`: Đánh dấu bài viết nổi bật (true/false)

### Bước 3: Thêm nội dung bài viết

Sau phần frontmatter, bạn có thể thêm nội dung bài viết sử dụng cú pháp markdown.

```markdown
# Tiêu đề bài viết

Đây là đoạn văn đầu tiên của bài viết.

## Tiêu đề phụ

Đây là đoạn văn trong phần tiêu đề phụ.

### Tiêu đề cấp 3

- Danh sách item 1
- Danh sách item 2
- Danh sách item 3

#### Tiêu đề cấp 4

1. Danh sách có thứ tự 1
2. Danh sách có thứ tự 2
3. Danh sách có thứ tự 3
```

### Bước 4: Thêm hình ảnh vào bài viết

#### 4.1. Tải hình ảnh lên thư mục

Đầu tiên, tải hình ảnh của bạn vào thư mục `hype4/blog/images/`.

#### 4.2. Thêm hình ảnh vào bài viết

Có hai cách để thêm hình ảnh vào bài viết:

**Cách 1: Sử dụng cú pháp markdown**

```markdown
![Mô tả hình ảnh](/blog/images/ten-file-anh.webp)
```

**Cách 2: Sử dụng thẻ HTML để có thêm tùy chỉnh**

```markdown
<img src="/blog/images/ten-file-anh.webp" alt="Mô tả hình ảnh" style="width:100%;max-width:600px;margin:0 auto;display:block;">
```

### Bước 5: Định dạng nội dung

#### Đoạn văn

Để tạo đoạn văn mới, chỉ cần thêm một dòng trống giữa các đoạn văn.

#### Định dạng chữ

- *In nghiêng*: `*text*` hoặc `_text_`
- **In đậm**: `**text**` hoặc `__text__`
- ***In đậm và nghiêng***: `***text***`
- ~~Gạch ngang~~: `~~text~~`

#### Liên kết

```markdown
[Văn bản hiển thị](https://example.com)
```

#### Trích dẫn

```markdown
> Đây là một trích dẫn.
> 
> Đây là đoạn thứ hai của trích dẫn.
```

#### Mã nguồn

Mã nguồn inline: `code`

Khối mã nguồn:

```
```javascript
function example() {
  console.log("Hello, world!");
}
```
```

#### Bảng

```markdown
| Cột 1 | Cột 2 | Cột 3 |
|-------|-------|-------|
| A1    | B1    | C1    |
| A2    | B2    | C2    |
| A3    | B3    | C3    |
```

## Mẫu bài viết

Dưới đây là mẫu đầy đủ cho một bài viết mới:

```markdown
---
title: Hướng dẫn sử dụng Hyperliquid Vault
date: 2025-06-01
author: Team HyperVN
category: tutorial
readTime: 8
excerpt: Tìm hiểu cách sử dụng Hyperliquid Vault để tối ưu hóa lợi nhuận từ tài sản của bạn trên nền tảng Hyperliquid.
image: <img src="/blog/images/vault-guide.webp" alt="Hyperliquid Vault Guide" style="width:100%;height:auto;">
featured: false
---

# Hướng dẫn sử dụng Hyperliquid Vault

Hyperliquid Vault là một tính năng mới cho phép người dùng kiếm lợi nhuận từ tài sản của họ mà không cần tham gia trực tiếp vào giao dịch.

## Vault là gì?

Vault là các quỹ được quản lý bởi các nhà giao dịch chuyên nghiệp, nơi người dùng có thể gửi tiền vào để kiếm lợi nhuận mà không cần tự mình giao dịch.

## Các loại Vault trên Hyperliquid

Hyperliquid hiện cung cấp ba loại vault chính:

1. **Yield Vault**: Tập trung vào việc tạo ra lợi nhuận ổn định với rủi ro thấp
2. **Growth Vault**: Mục tiêu tăng trưởng vốn với rủi ro trung bình
3. **Alpha Vault**: Chiến lược giao dịch tích cực với rủi ro cao hơn nhưng tiềm năng lợi nhuận lớn

![Các loại Vault trên Hyperliquid](/blog/images/vault-types.webp)

## Cách tham gia Vault

### Bước 1: Kết nối ví

Đầu tiên, kết nối ví MetaMask hoặc Rabby của bạn với nền tảng Hyperliquid.

### Bước 2: Nạp USDC

Nạp USDC vào tài khoản Hyperliquid của bạn từ mạng Arbitrum.

### Bước 3: Chọn Vault

Truy cập tab "Vault" và duyệt qua các vault có sẵn. Mỗi vault sẽ hiển thị:

- Tên và mô tả
- APY lịch sử
- Chiến lược giao dịch
- Phí quản lý và hiệu suất

### Bước 4: Gửi tiền vào Vault

Nhấp vào "Deposit" và nhập số tiền USDC bạn muốn gửi vào vault.

> **Lưu ý**: Hãy đọc kỹ các điều khoản và điều kiện trước khi gửi tiền vào bất kỳ vault nào.

## Theo dõi hiệu suất

Sau khi gửi tiền vào vault, bạn có thể theo dõi hiệu suất của mình trong tab "Portfolio". Tại đây, bạn sẽ thấy:

- Số dư hiện tại
- Lợi nhuận/lỗ
- Lịch sử giao dịch của vault

## Rút tiền từ Vault

Để rút tiền từ vault:

1. Truy cập tab "Vault"
2. Chọn vault bạn đã gửi tiền
3. Nhấp vào "Withdraw"
4. Nhập số tiền bạn muốn rút

Thời gian xử lý rút tiền có thể khác nhau tùy thuộc vào vault cụ thể và điều kiện thị trường.

## Kết luận

Hyperliquid Vault là một cách tuyệt vời để tham gia vào thị trường crypto mà không cần kiến thức chuyên sâu về giao dịch. Bằng cách chọn vault phù hợp với mục tiêu đầu tư và khẩu vị rủi ro của bạn, bạn có thể tối đa hóa tiềm năng lợi nhuận từ tài sản crypto của mình.

Hãy nhớ rằng tất cả các hình thức đầu tư đều có rủi ro, và hiệu suất trong quá khứ không đảm bảo kết quả trong tương lai.
```

## Lưu ý quan trọng

1. **Hình ảnh**: Đảm bảo hình ảnh có kích thước phù hợp (khuyến nghị dưới 1MB) và định dạng webp hoặc png để tối ưu tốc độ tải trang.

2. **Slug**: Tên file markdown sẽ trở thành slug trong URL của bài viết, vì vậy hãy đặt tên file ngắn gọn, không dấu và sử dụng dấu gạch ngang thay cho khoảng trắng.

3. **Frontmatter**: Đảm bảo frontmatter được định dạng chính xác với các trường bắt buộc (title, date, category, excerpt, image).

4. **Responsive**: Khi sử dụng thẻ HTML cho hình ảnh, hãy đảm bảo chúng hiển thị tốt trên các thiết bị di động bằng cách sử dụng CSS responsive.

5. **SEO**: Sử dụng các tiêu đề (h1, h2, h3) một cách hợp lý và bao gồm các từ khóa liên quan trong nội dung để tối ưu hóa SEO.
