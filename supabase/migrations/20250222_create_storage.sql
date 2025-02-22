-- Create a bucket for meal images
insert into storage.buckets (id, name)
values ('meal-images', 'meal-images')
on conflict (id) do nothing;

-- Set up storage policies
create policy "Users can view their own meal images"
  on storage.objects for select
  using (bucket_id = 'meal-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can upload their own meal images"
  on storage.objects for insert
  with check (
    bucket_id = 'meal-images' 
    and auth.uid()::text = (storage.foldername(name))[1]
    and (storage.foldername(name))[1] IS NOT NULL
  );

create policy "Users can update their own meal images"
  on storage.objects for update
  using (bucket_id = 'meal-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own meal images"
  on storage.objects for delete
  using (bucket_id = 'meal-images' and auth.uid()::text = (storage.foldername(name))[1]);
