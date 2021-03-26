SELECT p.id AS post_id, title, content, img, profile_pic, date_created, username AS author_username FROM helo_posts p
JOIN helo_users u ON u.id = p.author_id
WHERE lower(title) LIKE $1 AND p.author_id != $2
ORDER BY date_created ASC;