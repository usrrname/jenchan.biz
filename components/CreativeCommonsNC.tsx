const CreativeCommonsNC = () => {
  return (
    <div className="mt-6 justify-center gap-x-2 text-left text-sm">
      <span>{new Date().getFullYear()} Jen Chan</span>
      <a
        href="https://creativecommons.org/licenses/by-nc/4.0/"
        className="flex items-center"
      >
        <span className="text-primary-500">CC BY-NC 4.0</span>
        <img
          src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"
          alt=""
          style={{ maxWidth: '1em', maxHeight: '1em', marginLeft: '.2em' }}
        />
        <img
          src="https://mirrors.creativecommons.org/presskit/icons/by.svg"
          alt=""
          style={{ maxWidth: '1em', maxHeight: '1em', marginLeft: '.2em' }}
        />
        <img
          src="https://mirrors.creativecommons.org/presskit/icons/nc.svg"
          alt=""
          style={{ maxWidth: '1em', maxHeight: '1em', marginLeft: '.2em' }}
        />
      </a>
    </div>
  )
}

export default CreativeCommonsNC
