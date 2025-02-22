-- Enable the moddatetime extension
create extension if not exists moddatetime;

-- Create meals table
create type meal_type as enum ('breakfast', 'lunch', 'dinner', 'snack');

create table meals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  meal_type meal_type not null,
  eaten_at timestamp with time zone not null,
  name text not null,
  calories integer,
  protein float,
  fat float,
  carbohydrates float,
  notes text,
  image_url text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table meals enable row level security;

-- Create RLS policies
create policy "Users can view their own meals"
  on meals for select
  using (auth.uid() = user_id);

create policy "Users can insert their own meals"
  on meals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own meals"
  on meals for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own meals"
  on meals for delete
  using (auth.uid() = user_id);

-- Create updated_at trigger
create trigger handle_updated_at before update on meals
  for each row execute procedure moddatetime (updated_at);

-- Create indexes
create index meals_user_id_idx on meals(user_id);
create index meals_eaten_at_idx on meals(eaten_at);
